import { REQUEST } from "@nestjs/core";
import { Inject, Injectable } from "@nestjs/common";
// core
import { CoreApiService, CoreI18nService, CoreSysConfigService, PrismaService, RequestDto } from "../../../core";
import { AuthService } from "../../../modules";
// local
import { RoutineConfigAddDto, RoutineConfigDelDto, RoutineConfigEditDto, RoutineConfigQueryDto } from "./dto";
import { RoutineConfigCrudService } from "./config.crud";
import { ApiResponse } from "../../../shared";

@Injectable()
export class RoutineConfigService extends CoreApiService {
  constructor(
    @Inject(REQUEST) public readonly req: RequestDto,
    public prisma: PrismaService,
    public coreAuthService: AuthService,
    public crudService: RoutineConfigCrudService,
    public i18n: CoreI18nService,
    public sysConfig: CoreSysConfigService,
  ) {
    super(req, prisma, crudService, coreAuthService);
  }
  t(key: string, ...args: any[]) {
    return this.i18n.t('routine.config', key, ...args);
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
  async index(query: RoutineConfigQueryDto) {
    const configGroup = await this.sysConfig.getSysConfig('config_group');
    const configs = await this.sysConfig.getSysConfig(undefined, undefined, false);

    const data = {};
    const newConfigGroup = {};
    for (const { key, value } of configGroup) {
      data[key] = data[key] || {
        name: key,
        title: this.t(value),
      };
      newConfigGroup[key] = data[key].title;
    }

    for (const item of configs) {
      if (item.group in newConfigGroup) {
        item.title = this.t(item.title);
        data[item.group].list = data[item.group].list || [];
        data[item.group].list.push(item);
      }
    }

    return ApiResponse.success('', {
      'list': data,
      'remark': await this.coreAuthService.getRouteRemark(),
      'configGroup': newConfigGroup ?? {},
      'quickEntrance': await this.sysConfig.getSysConfig('config_quick_entrance'),
    });

    return {
      configGroup,
      configs,
    }
  }
}