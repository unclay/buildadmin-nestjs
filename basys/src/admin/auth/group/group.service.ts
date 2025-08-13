import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/services/prisma.service';
import { AuthGroupIndexQueryDto } from './group.dto';
import { AuthService } from '../../../modules/auth/auth.service';
import { REQUEST } from '@nestjs/core';
import { BaTree } from '../../../extend/ba/Tree';

@Injectable()
export class AuthGroupService {
    constructor(
        private prisma: PrismaService,
        private authService: AuthService,
        @Inject(REQUEST) private readonly req: Request
    ) {}
    getAssembleTree(query: AuthGroupIndexQueryDto) {
        const {
            initValue = [],
            isTree = true,
        } = query;
        return isTree && initValue.length === 0;
    }
    async getOptions(query: AuthGroupIndexQueryDto) {
        // /admin/auth.Group/index?select=true&quickSearch=&isTree=true&absoluteAuth=1&uuid=_226043698171754924747730&page=1&initKey=id
        // const list = await this.prisma.baAdminGroup.findMany();
        const list = await this.getGroups((this.req as any).user, query);
        return {
            options: list,
            query,
        }
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
        const isSuperAdmin = await this.authService.isSuperAdmin(admin.id);
        const {
            initKey = 'id',
            absoluteAuth = false,
            quickSearch: keyword,
            initValue = [],
        } = query;

        // 处理关键词搜索
        if (keyword && quickSearchField) {
            const keywords = keyword.split(' ')
            where.OR = keywords.map(item => ({
                [quickSearchField]: { contains: item }
            }))
        }
        
        // 处理初始值
        if (initValue.length > 0) {
            where[initKey] = { in: initValue }
        }

        // 权限处理
        if (!isSuperAdmin) {
            const authGroups = await this.authService.getAllAuthGroups(admin.id, authMethod, where)
            const groupIds = absoluteAuth ? authGroups : [...adminGroups, ...authGroups]
            where.id = { in: groupIds }
        }

        // 查询数据
        const data = await this.prisma.baAdminGroup.findMany({ where })

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

    // async create(body: any) {
    //     if (!body || Object.keys(body).length === 0) {
    //         throw new ApiException('Parameters cannot be empty', HttpStatus.BAD_REQUEST);
    //     }
    //     body = this.excludeFields(body);
    //     body = await this.handleRules(body);
    //     return this.prisma.baAdmin.create(body);
    // }

    // private excludeFields(data: any): any {
    //     const excludedFields = ['create_time', 'update_time']; // 示例
    //     return Object.fromEntries(
    //         Object.entries(data).filter(([key]) => !excludedFields.includes(key)),
    //     );
    // }

    // arrayDiff(array1, array2) {
    //     const set2 = new Set(array2);
    //     return array1.filter(item => !set2.has(item));
    // }
    // /**
    //  * 权限节点入库前处理
    //  * @throws Throwable
    //  */
    // async handleRules(data: any) {
    //     if (data.rules && data.rules.length) {
    //         let superAdmin = true;
    //         const checkedRules = [];
    //         const allRules = await this.prisma.baAdminRule.findMany({
    //             select: {
    //                 id: true
    //             }
    //         });
    //         const allRuleIds = allRules.map(item => item.id);
    //         // 遍历检查权限ID是否存在（以免传递了可预测的未来权限ID号）
    //         for (const postRuleId of data.rules) {
    //             if (allRuleIds.includes(postRuleId)) {
    //                 checkedRules.push(postRuleId);
    //             }
    //         }
    //         // 正在建立超管级分组？
    //         for (const ruleId of allRuleIds) {
    //             if (checkedRules.includes(ruleId)) {
    //                 superAdmin = false;
    //             }
    //         }
    //         const uid = (this.req as any).user?.id;
    //         if (superAdmin && this.authService.isSuperAdmin(uid)) {
    //             // 允许超管建立超管级分组
    //             data.rules = '*';
    //         } else {
    //             // 当前管理员所拥有的权限节点
    //             const ownedRuleIds = this.authService.getRuleIds(uid);
    //             // 禁止添加`拥有自己全部权限`的分组
    //             if (!this.arrayDiff(ownedRuleIds, checkedRules)) {
    //                 throw new ApiException('Role group has all your rights, please contact the upper administrator to add or do not need to add!')
    //             }
    //             // 检查分组权限是否超出了自己的权限（超管的 $ownedRuleIds 为 ['*']，不便且可以不做此项检查）
    //             if (this.arrayDiff(checkedRules, ownedRuleIds) && !this.authService.isSuperAdmin(uid)) {
    //                 throw new ApiException('The group permission node exceeds the range that can be allocated');
    //             }
    //             data.rules = checkedRules.join(',');
    //         }
    //     } else {
    //         delete data.rules;
    //     }
    //     return data;
    // }
}
