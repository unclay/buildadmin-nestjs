import { REQUEST } from "@nestjs/core";
import { Inject, Injectable } from "@nestjs/common";
// core
import { CoreApiService, CoreI18nService, PrismaService, RequestDto } from "../../../core";
import { AuthService } from "../../../modules";
// local
import { RoutineConfigAddDto, RoutineConfigDelDto, RoutineConfigEditDto, RoutineConfigQueryDto } from "./dto";
import { RoutineConfigCrudService } from "./config.crud";

@Injectable()
export class RoutineConfigService extends CoreApiService {
    constructor(
        @Inject(REQUEST) public readonly req: RequestDto,
        public prisma: PrismaService,
        public coreAuthService: AuthService,
        public crudService: RoutineConfigCrudService,
        public i18n: CoreI18nService,
    ) {
        super(req, prisma, crudService, coreAuthService);
    }
    add(body: RoutineConfigAddDto) {
        return {
            method: 'add',
            body,
        };
    }
    del(query: RoutineConfigDelDto) {
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
    postEdit(body: RoutineConfigEditDto) {
        return {
            method: 'postEdit',
            body
        };
    }
    index(query: RoutineConfigQueryDto) {
        return {
            method: 'index',
            query
        };
    }
}