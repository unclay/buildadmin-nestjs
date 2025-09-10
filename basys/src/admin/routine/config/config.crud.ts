import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "../../../core";
import { Prisma } from "@prisma/client";
import { strAttrToArray } from "../../../shared";

@Injectable()
export class RoutineConfigCrudService extends BaseCrudService {
  constructor() {
    super();
  }
  protected needContent = ['radio', 'checkbox', 'select', 'selects'];
  // protected preExcludeFields = ['content', 'rule', 'extend', 'inputExtend'];
  public async init() {
    this.model = this.prisma.baConfig;
    super.init();
  }
  public async create(configData: Prisma.BaConfigCreateInput & {
    inputExtend?: string;
  }) {
    // 处理 content
    if (!this.needContent.includes(configData.type)) {
      configData.content = null;
    } else {
      configData.content = JSON.stringify(strAttrToArray(configData.content));
    }

    // 处理 rule
    if (Array.isArray(configData.rule)) {
      configData.rule = configData.rule.join(',');
    }

    // 处理 extend
    if (configData.extend || configData.inputExtend) {
      const extend = strAttrToArray(configData.extend || '');
      const inputExtend = strAttrToArray(configData.inputExtend || '');

      if (inputExtend) extend.baInputExtend = inputExtend;
      if (Object.keys(extend).length > 0) {
        configData.extend = JSON.stringify(extend);
      }
    }
    delete configData.inputExtend;

    // 设置 allow_del
    configData.allow_del = 1;

    return await this.model.create({
      data: configData,
    });
  }
}
