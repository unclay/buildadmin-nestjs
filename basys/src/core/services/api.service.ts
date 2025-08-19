import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { CoreAuthService } from "./auth.service";
// core
import { array_unique } from '../../common';
// extend
import { BaApi } from "../../extend/ba/BaApi";
import { RequestDto } from "../dto/request.dto";
import { ApiException } from "../exceptions/api.exception";

@Injectable()
export class CoreApiService extends BaApi {
    protected pk = 'id';
    protected dataLimit: boolean | number | string = false;
    protected dataLimitField: string = 'admin_id';
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
        public readonly coreAuthService: CoreAuthService,
    ) {
        super()
    }
    /**
     * 返回 API 数据
     * @param string      $msg     提示消息
     * @param mixed       $data    返回数据
     * @param int         $code    错误码
     * @param string|null $type    输出类型
     * @param array       $header  发送的 header 信息
     * @param array       $options Response 输出参数
     */
    result(msg: string, data: any = null, code: number = 0, type?: string, header: Record<string, any> = {}, options: Record<string, any> = {}) {
        const result = {
            code: code,
            msg: msg,
            time: Math.floor(Date.now() / 1000),
            data: data,
        };

        const statusCode = header?.statusCode ?? HttpStatus.OK;
        delete header.statusCode;

        throw new HttpException(result, statusCode, options);
    }
    /**
     * 从 request 读取用户的属性值
     */
    getUser(key: string) {
        return (this.req as any).user[key];
    }
    /**
     * 从 request 设置用户的属性值
     */
    setUser(key: string, value: any) {
        (this.req as any).user[key] = value;
    }

    /**
     * 数据权限控制-获取有权限访问的管理员Ids
     * @throws Throwable
     */
    async getDataLimitAdminIds(): Promise<number[]>
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