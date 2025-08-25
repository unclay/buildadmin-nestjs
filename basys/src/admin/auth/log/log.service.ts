import { REQUEST } from "@nestjs/core";
import { Inject, Injectable } from "@nestjs/common";
// core
import { CoreApiService, CoreAuthService, PrismaService, RequestDto } from "../../../core";
// local
import { AuthAdminLogAddDto, AuthAdminLogDelDto, AuthAdminLogEditDto } from "./dto";
import { AdminLogCrudService } from "./log.crud";
import { ApiResponse } from "src/shared";

@Injectable()
export class AuthAdminLogService extends CoreApiService {
    protected preExcludeFields: string | string[] = ['create_time', 'admin_id', 'username'];
    protected quickSearchField: string | string[] = ['title'];
    constructor(
        @Inject(REQUEST) public readonly req: RequestDto,
        public prisma: PrismaService,
        public crudService: AdminLogCrudService,
        public coreAuthService: CoreAuthService,
    ) {
        super(req, prisma, crudService, coreAuthService);
    }
    add(body: AuthAdminLogAddDto) {
        return {
            method: 'add',
            body,
        };
    }
    del(query: AuthAdminLogDelDto) {
        return {
            method: 'del',
            query
        };
    }
    getEdit(id: number) {
        return {
            method: 'getEdit',
            id,
        };
    }
    postEdit(body: AuthAdminLogEditDto) {
        return {
            method: 'postEdit',
            body
        };
    }
    async index(query) {
        const dataLimitAdminIds = await this.getDataLimitAdminIds();
        const data = await this.queryBuilderService .queryBuilder(query, dataLimitAdminIds, this as any);
        const isSuperAdmin = await this.coreAuthService.isSuperAdmin();
        if (!isSuperAdmin) {
            data.where.admin_id = this.req.user.id;
        }
        // return data;
        const list = await this.model.findMany(data);
        const count = await this.model.count(data);
        return ApiResponse.success('', {
            list,
            total: count,
            remark: await this.coreAuthService.getRouteRemark()
        });
    }
}