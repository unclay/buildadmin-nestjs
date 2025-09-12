/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'node:path';
import fs from 'node:fs/promises';
import { REQUEST } from '@nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
// core
import {
  CoreApiService,
  CoreI18nService,
  CoreSysConfigService,
  PrismaService,
  RequestDto,
} from '../../../core';
import { AuthService } from '../../../modules';
// local
import {
  RoutineConfigAddDto,
  RoutineConfigDelDto,
  RoutineConfigEditDto,
} from './dto';
import { RoutineConfigCrudService } from './config.crud';
import { ApiResponse } from '../../../shared';
import { ConfigService } from '@nestjs/config';

import { ltrim } from '../../../shared/utils/php.util';

@Injectable()
export class RoutineConfigService extends CoreApiService {
  private filePath = {
    appConfig: 'config/app.php',
    webAdminBase: 'web/src/router/static/adminBase.ts',
    backendEntranceStub: 'app/admin/library/stubs/backendEntrance.stub',
  };
  protected preExcludeFields = [];
  constructor(
    @Inject(REQUEST) public readonly req: RequestDto,
    public prisma: PrismaService,
    public coreAuthService: AuthService,
    public crudService: RoutineConfigCrudService,
    public i18n: CoreI18nService,
    public sysConfig: CoreSysConfigService,
    public configService: ConfigService,
  ) {
    super(req, prisma, crudService, coreAuthService);
  }
  t(key: string, ...args: Record<string, any>[]) {
    return this.i18n.t('routine.config', key, ...args);
  }
  tCommon(key: string, ...args: Record<string, any>[]) {
    return this.i18n.t('common', key, ...args);
  }
  async add(body: RoutineConfigAddDto) {
    const data = this.excludeFields(body);
    const result = await this.crudService.create(data);
    await this.sysConfig.clearCache();

    if (result) {
      return ApiResponse.success(this.tCommon('Added successfully'));
    }
    throw ApiResponse.error(this.tCommon('No rows were added'));
  }
  async del(query: RoutineConfigDelDto) {
    const result = await this.crudService.del(query.ids);
    await this.sysConfig.clearCache();
    return result;
  }
  getEdit(id: number) {
    return {
      method: 'getEdit',
      id,
    };
  }
  async postEdit(xbody: RoutineConfigEditDto) {
    // $this -> modelValidate = false;
    // if (editorExists) {
    //   // 对请求体进行 XSS 过滤
    //   if (request.body) {
    //     this.cleanXss(request.body);
    //   }
    // }

    const body = this.excludeFields(xbody);
    const configValue = [];
    const all = await this.model.findMany();
    for (const item of all) {
      if (body[item.name]) {
        configValue.push({
          id: item.id,
          type: item.type,
          value: JSON.stringify(body[item.name]),
        });

        if (item.name === 'backend_entrance') {
          const backendEntrance = await this.sysConfig.get('backend_entrance');
          if (backendEntrance === body[item.name]) continue;

          if (!/^\/[a-zA-Z0-9]+$/.test(body[item.name])) {
            throw ApiResponse.error(this.t('Backend entrance rule'));
          }

          // 修改 adminBaseRoutePath
          const adminBaseFilePath = path.join(
            process.cwd(),
            this.filePath.webAdminBase,
          );
          let adminBaseContent = await fs.readFile(adminBaseFilePath, 'utf8');
          if (!adminBaseContent)
            throw ApiResponse.error(
              this.t('Configuration write failed: {s}', {
                s: this.filePath.webAdminBase,
              }),
            );
          adminBaseContent = adminBaseContent.replace(
            /export const adminBaseRoutePath = '.*?'/g,
            `export const adminBaseRoutePath = '${body[item.name]}'`,
          );
          const result = fs.writeFile(adminBaseFilePath, adminBaseContent);
          if (!result)
            throw ApiResponse.error(
              this.t('Configuration write failed: {s}', {
                s: this.filePath.webAdminBase,
              }),
            );

          // 去除后台入口开头的斜杠
          // const oldBackendEntrance = ltrim(backendEntrance, "/");
          const newBackendEntrance = ltrim(body[item.name], '/');

          // 设置应用别名映射
          const appMap = this.configService.get('app.app_map');
          const adminMapKey = appMap.indexOf('admin');
          if (adminMapKey !== -1) {
            appMap.splice(adminMapKey, 1);
          }
          if (newBackendEntrance != 'admin') {
            appMap[newBackendEntrance] = 'admin';
          }

          const appConfigFilePath = path.join(
            process.cwd(),
            this.filePath.appConfig,
          );
          const appConfigContent = await fs.readFile(appConfigFilePath, 'utf8');
          if (!appConfigContent)
            throw ApiResponse.error(
              this.t('Configuration write failed: {s}', {
                s: this.filePath.appConfig,
              }),
            );
        }
      }
    }

    try {
      await this.saveAll(configValue);
      await this.sysConfig.clearCache();
      return ApiResponse.success(
        this.t('The current page configuration item was updated successfully'),
      );
    } catch {
      throw ApiResponse.error(this.t('No rows updated'));
    }
  }
  async index() {
    const configGroup = await this.sysConfig.getSysConfig('config_group');
    const configs = await this.sysConfig.getSysConfig(
      undefined,
      undefined,
      false,
    );

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
      list: data,
      remark: await this.coreAuthService.getRouteRemark(),
      configGroup: newConfigGroup ?? {},
      quickEntrance: await this.sysConfig.getSysConfig('config_quick_entrance'),
    });

    return {
      configGroup,
      configs,
    };
  }

  private async saveAll(items: any[]) {
    return this.prisma.$transaction(
      items.map((item) =>
        this.model.upsert({
          where: { id: item.id ?? undefined }, // 使用name作为唯一标识符
          update: item,
          create: {
            ...item,
            id: undefined,
          },
        }),
      ),
    );
  }
}
