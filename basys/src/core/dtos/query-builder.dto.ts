import { plainToInstance, Transform, Type } from "class-transformer";
import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { TransformToNumber } from "../decorators";

export class QueryBuilderSearchDto {
    @IsNotEmpty({ message: '字段名不能为空' })
    @IsString({ message: '字段名必须是字符串' })
    @Transform(({ value }) => value?.trim())
    field: string;

    @IsNotEmpty({ message: '操作符不能为空' })
    @IsString({ message: '操作符必须是字符串' })
    @IsIn(['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'NOT LIKE', 'FIND_IN_SET', 'IN', 'NOT IN', 'NULL', 'NOT NULL', 'eq', 'RANGE', 'NOT RANGE'], {
        message: '操作符必须是有效的比较运算符'
    })
    operator: string;

    @IsNotEmpty({ message: '值不能为空' })
    @Transform(({ value, ...other }) => {
        // 尝试转换数字和布尔值
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (!isNaN(Number(value)) && value !== '') return Number(value);
        return value;
    })
    val: string | number | boolean;

    @IsOptional()
    @IsString({ message: '操作符必须是字符串' })
    @IsIn(['tag', 'datetime'], {
        message: '渲染器必须是有效的类型'
    })
    render: string;
}

export class QueryBuilderDto {
    @IsOptional()
    @IsString()
    quickSearch: string = '';

    @IsOptional()
    @IsNumber()
    @TransformToNumber()
    page: number = 1;

    @IsOptional()
    @IsNumber()
    @TransformToNumber()
    limit: number = 10;

    @IsOptional()
    @IsArray({ message: 'search参数必须是数组' })
    @ValidateNested({ each: true })
    @Type(() => QueryBuilderSearchDto)
    search?: QueryBuilderSearchDto[];

    @IsOptional()
    @IsString()
    initKey: string;

    @IsOptional()
    @IsNumber({}, { message: 'initValue必须是一个数字数组', each: true })
    @IsArray({ message: 'initValue必须是一个数字数组' })
    @TransformToNumber({ array: true })
    initValue?: number[];

    @IsOptional()
    @IsString()
    initOperator: string = 'in';
}

// const pk = 'test';
// const queryParams = plainToInstance(QueryBuilderDto, {});
// console.log(queryParams);
// const {
//     quickSearch,
//     limit,
//     search,
//     initKey = pk,
//     initValue,
//     initOperator
// } = queryParams;
// console.log(initKey);
