import { Injectable } from "@nestjs/common"
import { PrismaClient } from "@prisma/client";
// shared
import { array_unique, ApiResponse } from '../../shared';
// extend
import { BaApi } from "../../extend/ba/BaApi";
// core
import { CoreAuthService, BaseCrudService, RequestDto } from "..";

@Injectable()
export abstract class CoreApiService extends BaApi {
    /**
     * 开启数据限制
     * false=关闭
     * personal=仅限个人
     * allAuth=拥有某管理员所有的权限时
     * allAuthAndOthers=拥有某管理员所有的权限并且还有其他权限时
     * parent=上级分组中的管理员可查
     * 指定分组中的管理员可查，比如 $dataLimit = 2;
     * 启用请确保数据表内存在 admin_id 字段，可以查询/编辑数据的管理员为admin_id对应的管理员+数据限制所表示的管理员们
     * @var bool|string|int
     */
    protected dataLimit: boolean | number | string = false;
    /**
     * 数据限制字段
     * @var string
     */
    protected dataLimitField: string = 'admin_id';
    /**
     * 数据限制开启时自动填充字段值为当前管理员id
     * @var bool
     */
    protected dataLimitFieldAutoFill = true;
    /**
     * 有序保证
     * 查询数据时总是需要指定 ORDER BY 子句，否则 MySQL 不保证排序，即先查到哪行就输出哪行且不保证多次查询中的输出顺序
     * 将以下配置作为数据有序保证（用于无排序字段时、默认排序字段相同时继续保持数据有序），不设置将自动使用 pk 字段
     * @var string|array id,desc 或 ['id' => 'desc']（有更方便的格式，此处为了保持和 $defaultSortField 属性的配置格式一致）
     */
    protected orderGuarantee: null|string|Record<string, any> = {};
    /**
     * 默认排序
     * @var string|array id,desc 或 {'id': 'desc'}
     */
    protected defaultSortField: null|string|Record<string, any> = {};

    constructor(
        public readonly req: RequestDto,
        public readonly prisma: PrismaClient,
        public readonly crudService: BaseCrudService,
        public readonly coreAuthService: CoreAuthService,
    ) {
        super()
    }
    protected get pk() {
        return this.crudService.pk;
    }
    protected get model(): any {
        return this.crudService.model;
    }

    async initEdit(id: number) {
        return await this.crudService.find(id);
    }
    /**
     * 从 request 读取用户的属性值
     */
    getUser(key: string) {
        return this.req.user[key];
    }
    /**
     * 从 request 设置用户的属性值
     */
    setUser(key: string, value: any) {
        this.req.user[key] = value;
    }

    protected async checkAuth(adminId: number) {
        const dataLimitAdminIds = await this.getDataLimitAdminIds();
        if (dataLimitAdminIds?.length > 0 && !dataLimitAdminIds.includes(adminId)) {
            throw ApiResponse.error('You have no permission');
        }
    }

    /**
     * 数据权限控制-获取有权限访问的管理员Ids
     * @throws Throwable
     */
    protected async getDataLimitAdminIds(): Promise<number[]>
    {
        const isSuperAdmin = await this.coreAuthService.isSuperAdmin();
        if (!this.dataLimit || isSuperAdmin) {
            return [];
        }
        let adminIds = [];
        if (this.dataLimit === 'parent') {
            // 取得当前管理员的下级分组们
            const parentGroups = await this.coreAuthService.getAdminChildGroups();
            if (parentGroups) {
                // 取得分组内的所有管理员
                adminIds = await this.coreAuthService.getGroupAdmins(parentGroups);
            }
        } else if ((typeof this.dataLimit === 'number') && this.dataLimit as number > 0) {
            // 在组内，可查看所有，不在组内，可查看自己的
            adminIds = await this.coreAuthService.getGroupAdmins([this.dataLimit as number]);
            return adminIds.includes(this.coreAuthService.getUser('id')) ? [] : [this.coreAuthService.getUser('id')];
        } else if (this.dataLimit === 'allAuth' || this.dataLimit === 'allAuthAndOthers') {
            // 取得拥有他所有权限的分组
            const allAuthGroups = await this.coreAuthService.getAllAuthGroups(this.dataLimit);
            // 取得分组内的所有管理员
            adminIds = await this.coreAuthService.getGroupAdmins(allAuthGroups);
        }
        adminIds.push(this.coreAuthService.getUser('id'));
        return array_unique(adminIds);
    }


    /**
     * 查询的排序参数构建器
     */
    public queryOrderBuilder(): Record<string, string> {
        const order = (this.req.query.order as string) || this.defaultSortField;

        let orderObj: Record<string, string> = {};
        
        if (order && typeof order === 'string') {
            const [field, direction = 'asc'] = order.split(',');
            orderObj[field] = direction;
        }

        let orderGuarantee;
        if (!this.orderGuarantee) {
            orderGuarantee = { [this.pk]: 'desc' };
        } else if (typeof this.orderGuarantee === 'string') {
            const [field, direction = 'asc'] = this.orderGuarantee.split(',');
            orderGuarantee = { [field]: direction };
        } else {
            orderGuarantee = Object.assign({}, this.orderGuarantee);
        }

        const orderGuaranteeKey = Object.keys(orderGuarantee)[0];
        if (!(orderGuaranteeKey in orderObj)) {
            orderObj[orderGuaranteeKey] = orderGuarantee[orderGuaranteeKey];
        }

        return orderObj;
    }
}
