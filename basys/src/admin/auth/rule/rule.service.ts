import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
// core
import { RequestDto } from "../../../core/dto/request.dto";
import { CoreAuthService } from "../../../core/services/auth.service";
import { CoreApiService } from "../../../core/services/api.service";
import { PrismaService } from "../../../core/services/prisma.service";
// local
import { AuthRuleIndexQueryDto } from "./dto/query.dto";
import { BaTree } from "src/extend/ba/Tree";

@Injectable()
export class AuthRuleService extends CoreApiService {
    // baAdminRule 主键
    protected pk: string = 'id';
    protected quickSearchField: string = 'title';
    constructor(
        @Inject(REQUEST) public readonly req: RequestDto,
        public coreAuthService: CoreAuthService,
        private prisma: PrismaService,
    ) {
        super(req, coreAuthService);
    }

    /**
     * 重写select方法
     * @throws Error
     */
    async select(): Promise<any> {
        const data = await this.getMenus({
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
    async getMenus(where: { [key: string]: any } = {}) {
        const query = this.req.query as AuthRuleIndexQueryDto;
        const {
            initKey = this.pk,
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