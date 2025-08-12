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
}
