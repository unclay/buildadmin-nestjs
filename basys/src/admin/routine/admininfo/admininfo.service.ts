import { REQUEST } from "@nestjs/core";
import { Inject, Injectable } from "@nestjs/common";
// core
import { CoreApiService, CoreI18nService, PrismaService, RequestDto } from "../../../core";
import { AuthService } from "../../../modules";
// local
import { RoutineAdmininfoEditDto } from "./dto";
import { RoutineAdmininfoCrudService } from "./admininfo.crud";
import { ApiResponse } from "../../../shared";

@Injectable()
export class RoutineAdmininfoService extends CoreApiService {
  constructor(
    @Inject(REQUEST) public readonly req: RequestDto,
    public prisma: PrismaService,
    public coreAuthService: AuthService,
    public crudService: RoutineAdmininfoCrudService,
    public i18n: CoreI18nService,
  ) {
    super(req, prisma, crudService, coreAuthService);
  }
  getEdit(id: number) {
    return {
      method: 'getEdit',
      id,
    };
  }
  async postEdit(body: RoutineAdmininfoEditDto) {
    await this.crudService.find(body.id);
    if (body.avatar) {
      await this.crudService.update(body.id, {
        avatar: body.avatar,
      });
      return ApiResponse.success(this.i18n.t('admininfo', 'Avatar modified successfully!'));
    }
    if (body.password) {
      await this.coreAuthService.resetPassword(body.id, body.password);
    }
    await this.crudService.update(body.id, {
      nickname: body.nickname,
      email: body.email,
      mobile: body.mobile,
      motto: body.motto,
    });
    return ApiResponse.success(this.i18n.t('common', 'Update successful'));
  }
  async index() {
    const info = await this.getUser();
    return {
      info
    };
  }
}