import { plainToInstance } from "class-transformer";
import { QueryBuilderDto } from "../../../core";
import { parse_name } from "../../../shared";

export class QueryBuilderService {
  private static instance: QueryBuilderService;

  public static getInstance(): QueryBuilderService {
    if (!QueryBuilderService.instance) {
      QueryBuilderService.instance = new QueryBuilderService();
    }
    return QueryBuilderService.instance;
  }


  /**
   * 查询的排序参数构建器
   */
  public queryOrderBuilder(reqQuery, options: {
    pk: string,
    defaultSortField: null | string | Record<string, any>,
    orderGuarantee: null | string | Record<string, any>,
  }): Record<string, string> {
    let {
      pk,
      defaultSortField,
      orderGuarantee,
    } = options;
    let order: Record<string, 'asc' | 'desc'> = {};
    const orderParam = reqQuery.order as string || defaultSortField;

    if (orderParam && typeof orderParam === 'string') {
      const [field, direction = 'asc'] = orderParam.split(',');
      order[field] = direction as 'asc' | 'desc';
    }

    if (!orderGuarantee) {
      orderGuarantee = { [pk]: 'desc' };
    } else if (typeof orderGuarantee === 'string') {
      const [field, direction = 'asc'] = orderGuarantee.split(',');
      orderGuarantee = { [field]: direction as 'asc' | 'desc' };
    }

    const orderGuaranteeKey = Object.keys(orderGuarantee)[0];
    if (!order.hasOwnProperty(orderGuaranteeKey)) {
      order[orderGuaranteeKey] = orderGuarantee[orderGuaranteeKey];
    }

    return order;
  }


  public async queryBuilder(reqQuery, dataLimitAdminIds, options: {
    pk: string,
    defaultSortField: null | string | Record<string, any>,
    orderGuarantee: null | string | Record<string, any>,
    quickSearchField: string | string[],
    dataLimitField: string,
  }): Promise<any> {
    const {
      pk,
      quickSearchField,
      dataLimitField,
    } = options
    const queryParams = plainToInstance(QueryBuilderDto, reqQuery);
    let {
      quickSearch,
      page,
      limit,
      search,
      initKey = pk,
      initValue,
      initOperator
    } = queryParams;

    const where: any = {};
    const include: any = {};

    // 快速搜索
    if (quickSearch) {
      const quickSearchArr = Array.isArray(quickSearchField) ?
        quickSearchField :
        quickSearchField.split(',');
      const whereOr = quickSearchArr.map(key => ({
        [key]: {
          contains: quickSearch,
          mode: 'insensitive',
        }
      }));
      if (whereOr.length) {
        where.OR = whereOr;
      }
    }

    // 初始化查询
    if (initValue) {
      where[initKey] = this.buildPrismaCondition(initOperator, initValue.join('_'));
      limit = 999999;
    }

    // 通用搜索组装
    if (search && Array.isArray(search)) {
      for (const field of search) {
        if (!field?.operator || !field?.field || !field?.val) continue;

        const operator = this.getOperatorByAlias(field.operator);
        let fieldPath = field.field;

        // 处理关联表字段
        if (field.field.includes('.')) {
          const [relation, relationField] = field.field.split('.');
          const relationName = parse_name(relation, false); // 转换为小驼峰

          // 构建嵌套 where
          if (!where[relationName]) {
            where[relationName] = {
              some: {}
            };
          }

          where[relationName].some[relationField] = this.buildPrismaCondition(
            operator,
            field.val,
            field.render
          );
        } else {
          // 主表字段
          where[fieldPath] = this.buildPrismaCondition(
            operator,
            field.val,
            field.render
          );
        }
      }
    }

    // 数据权限
    // const dataLimitAdminIds = await this.getDataLimitAdminIds();
    if (dataLimitAdminIds.length) {
      where[dataLimitField] = {
        in: dataLimitAdminIds
      };
    }

    // 构建最终查询对象
    const query: any = {
      where,
      take: limit !== 999999 ? limit : undefined,
      skip: (page - 1) * limit !== 0 ? (page - 1) * limit : undefined
    };

    // 添加 include 如果有关联查询
    if (Object.keys(include).length > 0) {
      query.include = include;
    }

    // 添加排序
    const order = this.queryOrderBuilder(reqQuery, options);
    if (order && Object.keys(order).length > 0) {
      query.orderBy = this.convertToPrismaOrder(order);
    }

    return query;
  }
  private buildPrismaCondition(operator: string, value: any, renderType?: string): any {
    switch (operator) {
      case '=':
        return { equals: this.parseValue(value, renderType) };

      case '<>':
        return { not: this.parseValue(value, renderType) };

      case 'LIKE':
        if (typeof value === 'number') {
          return this.buildPrismaCondition('=', value, renderType);
        }
        return {
          contains: String(value).replace(/%/g, '\\%'),
          mode: 'insensitive'
        };

      case 'NOT LIKE':
        return {
          not: {
            contains: String(value).replace(/%/g, '\\%'),
            mode: 'insensitive'
          }
        };

      case '>':
        return { gt: this.parseValue(value, renderType) };

      case '>=':
        return { gte: this.parseValue(value, renderType) };

      case '<':
        return { lt: this.parseValue(value, renderType) };

      case '<=':
        return { lte: this.parseValue(value, renderType) };

      case 'BETWEEN':
        if (Array.isArray(value)) {
          return {
            gte: this.parseValue(value[0], renderType),
            lte: this.parseValue(value[1], renderType)
          };
        }
        return {};

      case 'RANGE':
        const arr = value.split(',');
        const json: any = {};
        if (arr[0]) {
          json.gte = this.parseValue(arr[0], renderType);
        }
        if (arr[1]) {
          json.lte = this.parseValue(arr[1], renderType);
        }
        return json;

      case 'NOT RANGE':
        const arr1 = value.split(',');
        const json1: any = {};
        if (arr1[0]) {
          json1.lte = this.parseValue(arr1[0], renderType);
        }
        if (arr1[1]) {
          json1.gte = this.parseValue(arr1[1], renderType);
        }
        return json1;

      case 'IN':
        return {
          in: Array.isArray(value) ? value.map(v => this.parseValue(v, renderType)) :
            String(value).split(',').map(v => this.parseValue(v, renderType))
        };

      case 'NOT IN':
        return {
          notIn: Array.isArray(value) ? value.map(v => this.parseValue(v, renderType)) :
            String(value).split(',').map(v => this.parseValue(v, renderType))
        };

      case 'NULL':
        return { equals: null };

      case 'NOT NULL':
        return { not: null };

      case 'FIND_IN_SET':
        // Prisma 不支持 FIND_IN_SET，可以用 OR 模拟
        const values = Array.isArray(value) ? value : String(value).split(',');
        return {
          OR: values.map(v => ({
            contains: `,${v},`,
            mode: 'insensitive'
          }))
        };

      default:
        return { equals: this.parseValue(value, renderType) };
    }
  }

  private parseValue(value: any, renderType?: string): any {
    if (renderType === 'datetime') {
      return Math.floor(new Date(value).getTime() * 0.001);
    }

    if (typeof value === 'string' && !isNaN(Number(value)) && value !== '') {
      return Number(value);
    }

    return value;
  }

  private convertToPrismaOrder(order: Record<string, string>): any {
    const result: any[] = [];

    for (const [field, direction = 'asc'] of Object.entries(order)) {
      if (field.includes('.')) {
        // 关联字段排序
        const [relation, relationField] = field.split('.');
        const relationName = parse_name(relation, false);

        result.push({
          [relationName]: {
            [relationField]: direction.toLowerCase()
          }
        });
      } else {
        // 主表字段排序
        result.push({ [field]: direction.toLowerCase() });
      }
    }

    return result;
  }

  /**
   * 从别名获取原始的逻辑运算符
   * @param string $operator 逻辑运算符别名
   * @return string 原始的逻辑运算符，无别名则原样返回
   */
  protected getOperatorByAlias(operator: string): string {
    const alias: Record<string, string> = {
      'ne': '<>',
      'eq': '=',
      'gt': '>',
      'egt': '>=',
      'lt': '<',
      'elt': '<='
    };

    return alias[operator] || operator;
  }
}