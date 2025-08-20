import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
// core
import { RequestDto } from "../../../core/dto/request.dto";
import { CoreAuthService } from "../../../core/services/auth.service";
import { CoreApiService } from "../../../core/services/api.service";
import { PrismaService } from "../../../core/services/prisma.service";
import { ApiException } from "../../../core/exceptions/api.exception";
// extend ba
import { BaTree } from "../../../extend/ba/Tree";
// local
import { AuthRuleAddDto, AuthRuleEditDto, AuthRuleIndexQueryDto } from "./dto";

@Injectable()
export class AuthRuleService extends CoreApiService {
    // baAdminRule 主键
    protected quickSearchField: string = 'title';
    protected preExcludeFields = ['create_time', 'update_time'];
    constructor(
        @Inject(REQUEST) public readonly req: RequestDto,
        public coreAuthService: CoreAuthService,
        private prisma: PrismaService,
    ) {
        super(req, coreAuthService);
    }

    async add(body: AuthRuleAddDto) {
        const data = this.excludeFields(body);
        if (this.dataLimit && this.dataLimitFieldAutoFill) {
            data[this.dataLimitField] = this.req.user.id;
        }
        let result = null;
        await this.prisma.$transaction(async (ctx) => {
            result = this.prisma.baAdminRule.create({
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
        return 'Added successfully';
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

    async edit(body: AuthRuleEditDto) {
        const row = await this.prisma.baAdminGroup.findFirst({ where: { id: body.id } });
        if (!row) {
            throw new ApiException('Record not found');
        }

        const dataLimitAdminIds = await this.getDataLimitAdminIds();
        if (dataLimitAdminIds?.length > 0 && !dataLimitAdminIds.includes(row[this.dataLimitField])) {
            throw new ApiException('You have no permission');
        }

        const newBody = this.excludeFields(body);
        try {
            await this.prisma.$transaction(async (ctx: PrismaService) => {
                if (newBody.pid > 0) {
                    // 满足意图并消除副作用
                    const parent = await ctx.baAdminGroup.findFirst({
                        where: {
                            id: newBody.pid
                        }
                    });
                    if (parent?.pid === row.id) {
                        await ctx.baAdminGroup.update({
                            where: { id: parent.id },
                            data: { pid: 0 }
                        });
                    }
                }
            });
            return 'Update successful';
        } catch(e) {
            console.error(e);
            throw new ApiException('No rows updated');
        }
        
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
        const rules = await this.prisma.baAdminRule.findMany({
            where,
            orderBy: this.queryOrderBuilder(),
        })

        // 如果要求树状，此处先组装好 children
        return this.req.assembleTree ? await BaTree.getInstance().assembleChild(rules) : rules;
    }
}