/* eslint-disable @typescript-eslint/no-explicit-any */
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../core';

export class BaAuth {
  constructor(public prisma: PrismaService) {}
  /**
   * 默认配置
   * @var array|string[]
   */
  protected config = {
    auth_group: 'baAdminGroup', // 用户组数据表名
    auth_group_access: 'baAdminGroupAccess', // 用户-用户组关系表
    auth_rule: 'baAdminRule', // 权限规则表
  };
  /**
   * 子菜单规则数组
   * @var array
   */
  protected children = [];
  /**
   * 获取权限规则ids
   * @param int $uid
   * @return array
   * @throws Throwable
   */
  async getRuleIds(uid: number): Promise<string[]> {
    // 用户的组别和规则ID
    const groups = await this.getGroups(uid);
    let ids: string[] = [];

    for (const group of groups) {
      if (group.rules) {
        const ruleIds =
          group.rules === '*'
            ? ['*']
            : group.rules
                .split(',')
                .map((id) => id.trim())
                .filter((id) => id !== '')
                .map((id) => (id === '*' ? '*' : parseInt(id)));
        ids = [...ids, ...ruleIds];
      }
    }

    return [...new Set(ids)];
  }

  /**
   * 获取用户所有分组和对应权限规则
   * @param int $uid
   * @return array
   * @throws Throwable
   */
  async getGroups(uid: number): Promise<any[]> {
    const prismaName = this.config['auth_group_access'] || 'BaUser';
    let userGroups;

    if (this.config['auth_group_access']) {
      userGroups = await this.prisma[prismaName].findMany({
        select: {
          uid: true,
          group_id: true,
          group: {
            select: {
              id: true,
              pid: true,
              name: true,
              rules: true,
            },
          },
        },
        where: {
          uid: uid,
          group: {
            status: 1,
          },
        },
      });

      // 将嵌套的group数据平铺
      userGroups = _.map(userGroups, (item) =>
        _.pick(
          {
            ...item,
            ...item.group,
          },
          ['uid', 'group_id', 'id', 'pid', 'name', 'rules'],
        ),
      );
    } else {
      userGroups = await this.prisma[prismaName].findMany({
        select: {
          id: true,
          group_id: true,
          group: {
            select: {
              id: true,
              name: true,
              rules: true,
            },
          },
        },
        where: {
          id: uid,
          group: {
            status: '1',
          },
        },
      });

      // 将嵌套的group数据平铺
      userGroups = _.map(userGroups, (item) =>
        _.pick(
          {
            ...item,
            ...item.group,
          },
          ['uid', 'group_id', 'id', 'name', 'rules'],
        ),
      );
    }

    return userGroups;
  }

  /**
   * 获取菜单规则列表
   * @access public
   * @param int $uid 用户ID
   * @return array
   * @throws Throwable
   */
  async getMenus(uid: number): Promise<any[]> {
    this.children = [];
    const originAuthRules = await this.getOriginAuthRules(uid);
    for (const rule of originAuthRules) {
      if (!this.children[rule.pid]) {
        this.children[rule.pid] = [];
      }
      this.children[rule.pid].push(rule);
    }

    // 没有根菜单规则
    if (!this.children[0]) return [];

    return this.getChildren(this.children[0]);
  }
  /**
   * 获得权限规则原始数据
   * @param int $uid 用户id
   * @return array
   * @throws Throwable
   */
  async getOriginAuthRules(uid: number): Promise<any[]> {
    const ids = await this.getRuleIds(uid);
    if (!ids.length) return [];

    const prismaName = this.config['auth_rule'];
    const where: any = {
      status: 1,
    };

    // 如果没有 * 则只获取用户拥有的规则
    if (!ids.includes('*')) {
      where.id = {
        in: ids,
      };
    }

    const rules = await this.prisma[prismaName].findMany({
      select: {
        id: true,
        pid: true,
        type: true,
        title: true,
        name: true,
        path: true,
        icon: true,
        menu_type: true,
        component: true,
        keepalive: true,
        extend: true,
      },
      where: where,
      orderBy: [
        {
          weigh: 'desc',
        },
        {
          id: 'asc',
        },
      ],
    });

    return rules.map((rule) => {
      if (rule.keepalive) {
        rule.keepalive = rule.name;
      }
      return rule;
    });
  }
  /**
   * 获取传递的菜单规则的子规则
   * @param array $rules 菜单规则
   * @return array
   */
  private getChildren(rules: any[]): any[] {
    rules.forEach((rule, key) => {
      if (this.children[rule.id]) {
        rules[key].children = this.getChildren(this.children[rule.id]);
      }
    });
    return rules;
  }

  hashPassword(password, saltOrRounds = 12) {
    return bcrypt.hashSync(password, saltOrRounds);
  }
}
