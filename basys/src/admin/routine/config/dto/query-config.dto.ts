import { Transform } from "class-transformer";
import { IsArray, IsNumber, IsOptional } from "class-validator";
// core
import { TransformToNumber } from "../../../../core/decorators/dto.decorator";

export class RoutineConfigQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    return value === 'true';
  })
  select?: boolean;

  @IsOptional()
  quickSearch?: string;

  @IsOptional()
  initKey?: string;

  @IsOptional()
  @Transform(({ value }) => {
    return value === 'true';
  })
  isTree?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'initValue必须是一个数字数组', each: true })
  @IsArray({ message: 'initValue必须是一个数字数组' })
  @TransformToNumber({ array: true })
  initValue?: number[];
}