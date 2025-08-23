import { PrismaClient } from '@prisma/client';
// shared
import { ApiResponse } from '../../shared/api';
// core
import { PrismaService } from '../database';

// 定义所有可能的 Prisma 模型委托类型
type PrismaDelegate = {
    [K in keyof PrismaClient]: PrismaClient[K] extends { findMany: any } ? PrismaClient[K] : never;
}[keyof PrismaClient];

// 提取所有模型名称
export type PrismaModelName = keyof {
    [K in keyof PrismaClient as PrismaClient[K] extends PrismaDelegate ? K : never]: any;
};

// 定义一个类型，将驼峰命名转换为下划线命名
type PrismaTableName<T> = 
  T extends `${infer First}${infer Rest}`
    ? `${First extends Uppercase<First> ? '_' : ''}${Lowercase<First>}${PrismaTableName<Rest>}`
    : T;

// 测试
// type Test1 = PrismaTableName<'baAdmin'>;      // 结果为 'ba_admin'
// type Test2 = PrismaTableName<'baAdminGroup'>; // 结果为 'ba_admin_group'

type PrimaryKeyItem = {
    column_name: string
}
type PrimaryKeys = PrimaryKeyItem[]

export abstract class BaseCrudService {
    constructor(
        protected readonly prisma: PrismaService,
        private readonly modelName: PrismaModelName
    ) { }
    protected get tableName(): PrismaTableName<string> {
        return this.modelName.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase();
    }
    // getter model
    protected get model() {
        return this.prisma[this.modelName];
    }

    // this.prism.$transaction((ctx) => void)
    protected getModel(ctx: PrismaClient) {
        return (ctx ?? this.prisma)[this.modelName];
    }
    // 所有主键（复合主键 + 单一主键）
    protected async getPks(tableName?: PrismaTableName<string>): Promise<PrimaryKeys> {
        const result = await this.prisma.$queryRaw`
            SELECT a.attname AS column_name
            FROM pg_index i
            JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
            WHERE i.indrelid = ${tableName ?? this.tableName}::regclass
            AND i.indisprimary;
        `;
        return result as PrimaryKeys;
    }
    // 单一主键
    protected async getPk(): Promise<string> {
        const pks = await this.getPks();
        return pks[0].column_name;
    }

    /**
     * 删除
     * @param id 主键id
     * @returns 
     */
    public async del(ids: number[] = []): Promise<any> {
        const pk = await this.getPk();
        const where = { [pk]: { in: ids } };
        const model = this.model as any;
        const data = await model.findMany({ where });
        const { count } = await model.deleteMany({
            where: {
                [pk]: {
                    in: data.map(v => v.id)
                }
            }
        })
        if (count) {
            return ApiResponse.success('Deleted successfully');
        }
        throw ApiResponse.error('No rows were deleted');
    }
}
