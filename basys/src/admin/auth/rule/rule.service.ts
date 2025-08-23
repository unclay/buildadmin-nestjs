import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
// shared
import { ApiResponse } from "../../../shared/api";
// core
import { PrismaService, RequestDto, CoreApiService, PK, CoreAuthService } from "../../../core";
// extend ba
import { BaTree } from "../../../extend/ba";
// local
import { AuthRuleAddDto, AuthRuleDelDto, AuthRuleEditDto, AuthRuleIndexQueryDto } from "./dto";
import { AdminRuleCrudService } from "./rule.crud";

@Injectable()
export class AuthRuleService extends CoreApiService {
    protected pk: PK = 'id';
    protected get model() {
        return this.prisma.baAdminRule;
    }
    // baAdminRule 主键
    protected quickSearchField: string = 'title';
    protected preExcludeFields = ['create_time', 'update_time'];
    constructor(
        @Inject(REQUEST) public readonly req: RequestDto,
        public coreAuthService: CoreAuthService,
        public prisma: PrismaService,
        public crudService: AdminRuleCrudService,
    ) {
        super(req, prisma, crudService, coreAuthService);
    }

    test() {
        return 'test';
    }

    async add(body: AuthRuleAddDto) {
        const data = this.excludeFields(body);
        if (this.dataLimit && this.dataLimitFieldAutoFill) {
            data[this.dataLimitField] = this.req.user.id;
        }
        let result = null;
        await this.prisma.$transaction(async (ctx) => {
            result = await this.model.create({
                data,
            });

            // 检查所有非超管的分组是否应该拥有此权限
            if (data.pid) {
                // 查找所有非通配符权限的用户组
                const groups = await ctx.baAdminGroup.findMany({
                    where: {
                        rules: {
                            not: '*'
                        }
                    }
                });

                // 遍历用户组检查权限
                for (const group of groups) {
                    const rules = group.rules.split(',');
                    if (rules.includes(data.pid.toString()) && !rules.includes(result.id.toString())) {
                        rules.push(result.id.toString());
                        await ctx.baAdminGroup.update({
                            where: { id: group.id },
                            data: { rules: rules.join(',') }
                        });
                    }
                }
            }
        });
        return ApiResponse.success('Added successfully');
    }

    async del(body: AuthRuleDelDto) {
        const ids = body.ids || [];

        // 检查子级元素
        const subData = await this.model.findMany({
            where: {
                pid: {
                    in: ids
                }
            },
            select: {
                id: true,
                pid: true
            }
        });

        for (const item of subData) {
            if (!ids.includes(item.id)) {
                throw ApiResponse.error('Please delete the child element first, or use batch deletion');
            }
        }

        return this.crudService.del(ids);
    }
    
    async getEdit(id: number) {
        const row = await this.initEdit(id);
        this.checkAuth(row[this.dataLimitField]);
        return {
            row,
        }
    }

    async postEdit(body: AuthRuleEditDto) {
        const row = await this.initEdit(body.id);
        const newBody = this.excludeFields(body);
        let result;
        await this.prisma.$transaction(async (ctx: PrismaService) => {
            if (newBody.pid > 0) {
                // 满足意图并消除副作用
                const parent = await ctx.baAdminGroup.findFirst({
                    where: { id: newBody.pid }
                });
                if (parent?.pid === row.id) {
                    result = await ctx.baAdminGroup.update({
                        where: { id: parent.id },
                        data: { pid: 0 }
                    });
                }
            }
            result = await ctx.baAdminRule.update({
                where: { id: newBody.id },
                data: newBody,
            });
        });
        if (result) {
            return ApiResponse.success('Update successful');
        }
        throw ApiResponse.error('No rows updated');
    }


    /**
     * 重写select方法
     * @throws Error
     */
    async select(query: AuthRuleIndexQueryDto): Promise<any> {
        const data = await this.getMenus(query, {
            type: {
                in: ['menu_dir', 'menu']
            },
            status: 1
        });

        if (this.req.assembleTree) {
            const treeData = await BaTree.getTreeArray(data, 'title');
            return {
                options: await BaTree.assembleTree(treeData)
            };
        }

        return {
            options: data
        };
    }

    /**
     * 获取菜单列表
     * @throws Error
     */
    async getMenus(query: AuthRuleIndexQueryDto, where: { [key: string]: any } = {}) {
        const {
            initKey = 'id',
            quickSearch: keyword = '',
        } = query;
        const initValue = (query.initValue || []).filter(Boolean);
        const ids = await this.coreAuthService.getRuleIds();

        // 如果没有 * 则只获取用户拥有的规则
        if (!ids.includes('*')) {
            where[initKey] = {
                in: ids
            };
        }

        if (keyword) {
            const keywords = keyword.split(' ');
            for (const item of keywords) {
                where[this.quickSearchField] = {
                    contains: item
                }
            }
        }


        if (initValue.length) {
            where[initKey] = { in: initValue };
        }

        // 读取用户组所有权限规则
        const rules = await this.model.findMany({
            where,
            orderBy: this.queryOrderBuilder(),
        })

        // 如果要求树状，此处先组装好 children
        return this.req.assembleTree ? await BaTree.getInstance().assembleChild(rules) : rules;
    }
}