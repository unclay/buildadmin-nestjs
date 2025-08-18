import { Injectable, Request } from "@nestjs/common"
import { CoreAuthService } from "./auth.service";
// core
import { array_unique } from '../../common';
// extend
import { BaApi } from "../../extend/ba/BaApi";

@Injectable()
export class CoreApiService extends BaApi {
    protected dataLimit: boolean | number | string = false;
    protected dataLimitField: string = 'admin_id';
    constructor(
        public readonly req: Request,
        public readonly coreAuthService: CoreAuthService,
    ) {
        super()
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
}