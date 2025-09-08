import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiResponse, array_diff } from '../../../shared';
import { RequestDto, CoreApiService, PrismaService, CoreI18nService } from '../../../core';
import { AuthService } from "../../../modules";
import { BaTree } from '../../../extend/ba';
// local
import { AuthGroupAddDto, AuthGroupDelDto, AuthGroupEditDto, AuthGroupIndexQueryDto } from './dto';
import { AdminGroupCrudService } from './group.crud';


@Injectable()
export class AuthGroupService extends CoreApiService {
  /**
   * 修改、删除分组时对操作管理员进行鉴权
   * 本管理功能部分场景对数据权限有要求，修改此值请额外确定以下的 absoluteAuth 实现的功能
   * allAuthAndOthers=管理员拥有该分组所有权限并拥有额外权限时允许
   */
  protected authMethod: string = 'allAuthAndOthers';
  protected preExcludeFields = ['create_time', 'update_time'];
  constructor(
    public prisma: PrismaService,
    public authService: AuthService,
    @Inject(REQUEST) public readonly req: RequestDto,
    public crudService: AdminGroupCrudService,
    public i18n: CoreI18nService,
  ) {
    super(req, prisma, crudService, authService);
  }
  // 增删改查

  async postAdd(body: AuthGroupAddDto) {
    let data = this.excludeFields(body);
    data = await this.handleRules(data);

    let result = null;
    await this.prisma.$transaction(async (ctx: PrismaService) => {
      result = await ctx.baAdminGroup.create({
        data: {
          ...data,
        }
      });
    });
    if (result) {
      return ApiResponse.success('Added successfully');
    }
    throw ApiResponse.error('No rows were added');
  }

  async del(body: AuthGroupDelDto) {
    const ids = body.ids;
    const data = await this.model.findMany({
      where: {
        id: { in: ids }
      }
    });
    for (const v of data) {
      this.checkAuth(v.id);
    }
    let subData = await this.model.findMany({
      where: {
        pid: { in: ids }
      },
      select: {
        pid: true,
        id: true,
      }
    });
    for (const subDatum of subData) {
      if (!ids.includes(subDatum.id)) {
        throw ApiResponse.error('Please delete the child element first, or use batch deletion');
      }
    }

    const adminGroups = await this.prisma.baAdminGroupAccess.findMany({
      where: {
        uid: this.req.user.id,
      },
      select: {
        group_id: true
      }
    });
    const adminGroupIds = adminGroups.map(item => item.group_id);

    let count = 0;
    for (const item of data) {
      if (!adminGroupIds.includes(item.id)) {
        await this.model.delete({
          where: { id: item.id }
        });
        count++;
      }
    }
    if (count) {
      return ApiResponse.success('Deleted successfully');
    } else {
      throw ApiResponse.error('No rows were deleted');
    }
  }

  async getEdit(id: number) {
    const row = await this.initEdit(id);
    this.checkGroupAuth(row.id);

    // 读取所有pid，全部从节点数组移除，父级选择状态由子级决定
    // 获取所有唯一的pid
    const pidArr = await this.prisma.baAdminRule.findMany({
      where: {
        id: {
          in: row.rules.split(',').map(Number)
        }
      },
      select: {
        pid: true
      },
      distinct: ['pid']
    });

    // 处理规则数组
    let rules = row.rules ? row.rules.split(',') : [];

    // 移除父级规则
    pidArr.forEach(item => {
      const ruKey = rules.indexOf(item.pid.toString());
      if (ruKey !== -1) {
        rules.splice(ruKey, 1);
      }
    });

    // 更新规则
    (row as any).rules = rules;

    return {
      row: row
    };
  }
  async postEdit(body: AuthGroupEditDto) {
    const row = await this.initEdit(body.id);
    this.checkGroupAuth(row.id);
    const adminGroups = await this.prisma.baAdminGroupAccess.findMany({
      where: { uid: this.req.user.id },
      select: { group_id: true },
      distinct: ['group_id'],
    });
    const adminGroupIds = adminGroups.map(item => item.group_id);
    if (adminGroupIds.includes(body.id)) {
      throw ApiResponse.error('You cannot modify your own management group!');
    }
    let data = this.excludeFields(body);
    data = await this.handleRules(data);

    let result = null;
    await this.prisma.$transaction(async (ctx: PrismaService) => {
      result = await ctx.baAdminGroup.update({
        where: { id: data.id },
        data: {
          ...data,
          id: undefined
        }
      });
    });
    if (result) {
      return ApiResponse.success(this.i18n.t('common.Update successful'));
    }
    throw ApiResponse.error(this.i18n.t('common.Update failed'));
  }

  /**
   * 远程下拉
   * @return void
   * @throws Throwable
   */
  async select(query: AuthGroupIndexQueryDto) {
    let data = await this.getGroups(query, {
      status: 1
    });
    if (this.getAssembleTree(query)) {
      data = BaTree.assembleTree(BaTree.getTreeArray(data));
    }
    return {
      options: data,
    };
  }

  async getGroups(query: AuthGroupIndexQueryDto, where: any = {}) {
    const admin = (this.req as any).user;
    // 下拉选择时只获取：拥有所有权限并且有额外权限的分组
    const quickSearchField = 'name';
    const authMethod = 'allAuthAndOthers';
    const adminGroups = [];

    const {
      initKey = 'id',
      absoluteAuth = false,
      quickSearch: keyword,
    } = query;
    const initValue = (query.initValue || []).filter(Boolean);
    where.OR = where.OR || [];
    const isSuperAdmin = await this.coreAuthService.isSuperAdmin();


    // 处理关键词搜索
    if (keyword && quickSearchField) {
      const keywords = keyword.split(' ')
      for (const item of keywords) {
        where.OR.push({
          [quickSearchField]: { contains: item }
        })
      }
    }

    // 处理初始值
    if (initValue.length > 0) {
      where.OR.push({
        [initKey]: { in: initValue }
      });
    }

    if (where.OR.length === 0) {
      delete where.OR;
    }

    // 权限处理
    if (!isSuperAdmin) {
      const authGroups = await this.coreAuthService.getAllAuthGroups(authMethod, where)
      const groupIds = absoluteAuth ? authGroups : [...adminGroups, ...authGroups]
      where.id = { in: groupIds }
    }

    // 查询数据
    const data = await this.model.findMany({ where })

    // 处理权限显示
    for (const item of data) {
      if (item.rules) {
        if (item.rules === '*') {
          item.rules = 'Super administrator'
        } else {
          const rules = item.rules.split(',')
          if (rules.length > 0) {
            const firstRule = await this.prisma.baAdminRule.findUnique({
              where: { id: parseInt(rules[0]) },
              select: { title: true }
            })
            const rulesFirstTitle = firstRule?.title || ''
            item.rules = rules.length === 1
              ? rulesFirstTitle
              : `${rulesFirstTitle}等 ${rules.length} 项`
          }
        }
      } else {
        item.rules = 'No permission'
      }
    }

    // 组装树形结构
    return this.getAssembleTree(query) ? BaTree.getInstance().assembleChild(data) : data
  }



  /**
   * 检查权限
   * @param $groupId
   * @return void
   * @throws Throwable
   */
  private async checkGroupAuth(groupId: number): Promise<void> {
    const authGroups = await this.coreAuthService.getAllAuthGroups(this.req.user.id, {});
    const isSuperAdmin = await this.coreAuthService.isSuperAdmin();
    if (!isSuperAdmin && !authGroups.includes(groupId)) {
      throw ApiResponse.error(
        this.authMethod === 'allAuth'
          ? this.i18n.t('auth.admin.You need to have all permissions of this group to operate this group~')
          : this.i18n.t('auth.admin.You need to have all the permissions of the group and have additional permissions before you can operate the group~')
      );
    }
  }
  async getOptions(query: AuthGroupIndexQueryDto) {
    // /admin/auth.Group/index?select=true&quickSearch=&isTree=true&absoluteAuth=1&uuid=_226043698171754924747730&page=1&initKey=id
    // const list = await this.model.findMany();
    const list = await this.getGroups((this.req as any).user, query);
    return {
      options: list,
      query,
    }
  }

  // 辅助函数 - 组装树形结构
  async assembleChild(data: any[]) {
    // 这里实现树形结构组装逻辑
    // 可能需要根据你的数据结构调整
    const tree = []
    const map = new Map(data.map(item => [item.id, { ...item, children: [] }]))

    for (const item of map.values()) {
      if (item.pid && map.has(item.pid)) {
        map.get(item.pid).children.push(item)
      } else {
        tree.push(item)
      }
    }

    return tree
  }

  /**
   * 权限节点入库前处理
   * @throws Throwable
   */
  async handleRules(data: any) {
    if (data.rules && data.rules.length) {
      let superAdmin = true;
      const checkedRules = [];
      const allRules = await this.prisma.baAdminRule.findMany({
        select: {
          id: true
        }
      });
      const allRuleIds = allRules.map(item => item.id);
      // 遍历检查权限ID是否存在（以免传递了可预测的未来权限ID号）
      for (const postRuleId of data.rules) {
        if (allRuleIds.includes(postRuleId)) {
          checkedRules.push(postRuleId);
        }
      }
      // 正在建立超管级分组？
      for (const ruleId of allRuleIds) {
        if (checkedRules.includes(ruleId)) {
          superAdmin = false;
        }
      }
      const uid = this.req.user.id;
      const isSuperAdmin = await this.coreAuthService.isSuperAdmin();
      if (superAdmin && isSuperAdmin) {
        // 允许超管建立超管级分组
        (data as any).rules = '*';
      } else {
        // 当前管理员所拥有的权限节点
        const ownedRuleIds = await this.coreAuthService.getRuleIds();
        // 禁止添加`拥有自己全部权限`的分组
        if (!array_diff(ownedRuleIds, checkedRules)) {
          throw ApiResponse.error(this.i18n.t('auth.admin.Role group has all your rights, please contact the upper administrator to add or do not need to add!'))
        }
        // 检查分组权限是否超出了自己的权限（超管的 $ownedRuleIds 为 ['*']，不便且可以不做此项检查）
        if (array_diff(checkedRules, ownedRuleIds) && !isSuperAdmin) {
          throw ApiResponse.error(this.i18n.t('auth.admin.The group permission node exceeds the range that can be allocated'));
        }
        (data as any).rules = checkedRules.join(',');
      }
    } else {
      delete data.rules;
    }
    return data;
  }

  private getAssembleTree(query: AuthGroupIndexQueryDto) {
    const {
      initValue = [],
      isTree = true,
    } = query;
    return isTree && initValue.length === 0;
  }
}
