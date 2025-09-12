import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
// core
import { TransformToNumber } from '../../../../core/decorators/dto.decorator';

export class AuthRuleEditDto {
  @IsNumber({}, { message: 'id必须是数字' })
  @TransformToNumber()
  id: number;

  @IsOptional()
  @IsNotEmpty({ message: '名称不能为空' })
  name: string;

  @IsOptional()
  @IsNumber({}, { message: 'pid必须是数字' })
  @TransformToNumber()
  pid: number;

  @IsOptional()
  @IsEnum([0, 1], { message: 'keepalive 必须是0或1' })
  @TransformToNumber()
  keepalive: 0 | 1;

  @IsOptional()
  @IsNumber({}, { message: 'rules必须是一个数字数组', each: true })
  @IsArray({ message: 'rules必须是一个数字数组' })
  @TransformToNumber()
  rules: number[];

  @IsOptional()
  @IsEnum([0, 1], { message: 'status必须是0或1' })
  @TransformToNumber()
  status: 0 | 1;

  @IsOptional()
  @IsNumber({}, { message: 'weigh 必须是数字' })
  @TransformToNumber()
  weigh: number;
}
