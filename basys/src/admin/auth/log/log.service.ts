import { REQUEST } from "@nestjs/core";
import { Inject, Injectable } from "@nestjs/common";
// core
import { CoreApiService, CoreAuthService, PrismaService, RequestDto } from "../../../core";
// local
import { AuthAdminLogAddDto, AuthAdminLogDelDto, AuthAdminLogEditDto } from "./dto";
import { AdminLogCrudService } from "./log.crud";

@Injectable()
export class AuthAdminLogService extends CoreApiService {
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
    index(query) {
        return {
            method: 'index',
            query
        };
    }
}