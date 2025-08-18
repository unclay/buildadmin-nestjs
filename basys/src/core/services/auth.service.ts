import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from '@nestjs/core';
import { PrismaService } from "./prisma.service";
import { BaAuth } from '../../extend/ba/Auth';
import { array_diff } from "src/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class CoreAuthService extends BaAuth {
    protected dataLimit: boolean | number | string = false;
    protected dataLimitField: string = 'admin_id';
    constructor(
        @Inject(REQUEST) private readonly req: Request,
        public prismaService: PrismaService
    ) {
        super(prismaService);
    }
    /**
     * 从 request 读取用户的属性值
     */
    getUser(userField: string) {
        return (this.req as any).user[userField];
    }
    /**
     * 从 request 设置用户的属性值
     */
    setUser(key: string, value: any) {
        (this.req as any).user[key] = value;
    }

    /**
     * 是否超级管理员
     * @returns boolean
     */
    async isSuperAdmin() {
        // 读取缓存
        let isSuperAdmin = this.getUser('isSuperAdmin');
        if (typeof isSuperAdmin === 'boolean') return isSuperAdmin;
        // 读取数据库
        const rules = await this.getRuleIds(this.getUser('id'));
        isSuperAdmin = rules.includes('*');
        this.setUser('isSuperAdmin', isSuperAdmin);
        return isSuperAdmin;
    }

    /**
     * 重置管理员id
     * @param adminId 管理员id
     * @param password 未加密的密码
     * @param prisma 事务context，默认使用全局prisma实例，也可传外部事务的prisma实例（context）
     * @returns 
     */
    resetPassword(adminId: number, password: string, prisma?: Prisma.TransactionClient) {
        const ctx = prisma || this.prisma;
        return ctx.baAdmin.update({
            where: {
                id: adminId,
            },
            data: {
                password: this.hashPassword(password),
                update_time: BigInt(Date.now()),
            },
        });
    }

    /**
     * 获取管理员所在分组的所有子级分组
     * @return array
     * @throws Throwable
     */
    async getAdminChildGroups(){
        const groupIds = await this.prisma.baAdminGroupAccess.findMany({
            where: {
                uid: this.getUser('id')
            }
        })
        const children = [];
        for (const group of groupIds) {
            this.getGroupChildGroups(group.group_id, children);
        }
        return Array.from(new Set(children));
    }

    /**
     * 获取一个分组下的子分组
     * @param int   $groupId  分组ID
     * @param array $children 存放子分组的变量
     * @return void
     * @throws Throwable
     */
    async getGroupChildGroups(groupId: number, children: number[]) {
        const childrenTemp = await this.prisma.baAdminGroup.findMany({
            where: {
                pid: groupId,
                status: 1,
            }
        })
        for (const item of childrenTemp) {
            children.push(item.id);
            this.getGroupChildGroups(item.id, children);
        }
    }

    /**
     * 获取分组内的管理员
     * @param array $groups
     * @return array 管理员数组
     */
    async getGroupAdmins(groups: number[]) {
        const list = await this.prisma.baAdminGroupAccess.findMany({
            where: {
                group_id: {
                    in: groups
                }
            }
        });
        return list.map(item => item.uid);
    }

    /**
     * 获取拥有 `所有权限` 的分组
     * @param string $dataLimit       数据权限
     * @param array  $groupQueryWhere 分组查询条件（默认查询启用的分组：[['status','=',1]]）
     * @return array 分组数组
     * @throws Throwable
     */
    async getAllAuthGroups(dataLimit: string, groupQueryWhere = { status: 1 }) {
        // 当前管理员拥有的权限
        const rules = await this.getRuleIds(this.getUser('id'));
        const allAuthGroups = [];
        const groups = await this.prisma.baAdminGroup.findMany({
            where: groupQueryWhere
        });
        for (const group of groups) {
            if (group.rules === '*') {
                continue;
            }
            const groupRules = group.rules.split(',');

            // 及时break, array_diff 等没有 in_array 快
            let all = true;
            for (const groupRule of groupRules) {
                if (!rules.includes(groupRule)) {
                    all = false;
                    break;
                }
            }
            if (all) {
                if (dataLimit === 'allAuth' || (dataLimit === 'allAuthAndOthers' && array_diff(rules, groupRules))) {
                    allAuthGroups.push(group.id);
                }
            }
        }
            
        return allAuthGroups;
    }
}