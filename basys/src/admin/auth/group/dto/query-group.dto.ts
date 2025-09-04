import { Transform } from "class-transformer";
import { IsArray, IsNumber, IsOptional } from "class-validator";

export class AuthGroupIndexQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    return value === 'true';
  })
  select?: boolean;

  @IsOptional()
  quickSearch?: string;

  @IsOptional()
  @Transform(({ value }) => {
    return value === 'true';
  })
  isTree?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    return value === '1';
  })
  absoluteAuth?: boolean;

  @IsOptional()
  uuid?: string;

  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value, 10);
  })
  page?: number;

  @IsOptional()
  initKey?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((str) => parseInt(str, 10));
    }
    return value ? [parseInt(value, 10)] : [];
  })
  initValue?: number[];
}
