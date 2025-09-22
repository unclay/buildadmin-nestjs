/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import {
  InternalServerErrorException,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
// shared
import { ApiResponse } from '../../shared';
// core
import { PrismaService } from '../database';
import { CoreI18nService } from '../i18n';

// 定义所有可能的 Prisma 模型委托类型
type PrismaDelegate = {
  [K in keyof PrismaClient]: PrismaClient[K] extends { findMany: any }
    ? PrismaClient[K]
    : never;
}[keyof PrismaClient];

// 提取所有模型名称
export type PrismaModelName = keyof {
  [K in keyof PrismaClient as PrismaClient[K] extends PrismaDelegate
    ? K
    : never]: any;
};

type PrimaryKeyItem = {
  column_name: string;
};
type PrimaryKeys = PrimaryKeyItem[];

export abstract class BaseCrudService implements OnModuleInit {
  public model;
  public pk: string = 'id';

  // 注入服务
  @Inject(CoreI18nService)
  protected readonly i18n!: CoreI18nService;
  @Inject(PrismaService)
  protected readonly prisma: PrismaService;

  // 等待服务注入完成
  async onModuleInit() {
    this.init();
  }

  constructor() {}
  protected async init() {
    this.pk = await this.getPk();
  }
  private get modelName() {
    if (!this.model?.name) {
      throw new InternalServerErrorException(
        'Model is not properly initialized',
      );
    }
    return this.model.name;
  }
  public getModel(ctx: PrismaClient) {
    return (ctx ?? this.prisma)[this.modelName];
  }
  // 所有主键（复合主键 + 单一主键）
  public async getPks(modelName?: PrismaModelName): Promise<PrimaryKeys> {
    // PrismaModelName 防注入
    let tableName = modelName ?? this.modelName;
    if (!tableName) return [];
    // baAdminRule => ba_admin_rule
    tableName = tableName
      .replace(/([A-Z])/g, '_$1')
      .replace(/^_/, '')
      .toLowerCase();
    const result = await this.prisma.$queryRaw`
            SELECT a.attname AS column_name
            FROM pg_index i
            JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
            WHERE i.indrelid = ${tableName}::regclass
            AND i.indisprimary;
        `;
    return result as PrimaryKeys;
  }
  // 单一主键
  public async getPk(): Promise<string> {
    const pks = await this.getPks();
    return pks[0].column_name;
  }

  /**
   * 删除
   * @param ids 主键ids
   * @returns
   */
  public async del(ids: number[] = []): Promise<any> {
    const where = { [this.pk]: { in: ids } };
    const model = this.model as any;
    const data = await model.findMany({ where });
    const { count } = await model.deleteMany({
      where: {
        [this.pk]: {
          in: data.map((v) => v.id),
        },
      },
    });
    if (count) {
      return ApiResponse.success(this.i18n.t('common', 'Deleted successfully'));
    }
    throw ApiResponse.error(this.i18n.t('common', 'No rows were deleted'));
  }

  /**
   * 查询
   * @param id 主键id
   * @returns
   */
  public async find(id: number): Promise<any> {
    const model = this.model as any;
    const row = await model.findUnique({
      where: {
        [this.pk]: id,
      },
    });
    if (!row) {
      throw ApiResponse.error(this.i18n.t('common', 'Record not found'));
    }
    return row;
  }

  /**
   * 更新
   * @param id 主键id
   * @param data 更新数据
   * @returns 
   */
  public async update(id: number, data: Record<string, any>): Promise<any> {
    const model = this.model as any;
    return await model.update({
      where: {
        [this.pk]: id,
      },
      data,
    });
  }
}
