import { IsNotEmpty, ValidateIf } from "class-validator"
// core
import { i18nValidationNamespace, IsUnique } from "../../../../core";

export class RoutineConfigAddDto {
  @IsUnique('baConfig', 'name', {
    message: i18nValidationNamespace('common', '{field} already exist', { field: '名称' }),
  })
  @IsNotEmpty({
    message: i18nValidationNamespace('common', 'Parameter {s} can not be empty', { s: '名称' }),
  })
  name: string;

  @IsNotEmpty({
    message: '分组不能为空',
    context: {
      i18n: i18nValidationNamespace
    }
  })
  group: string;

  @IsNotEmpty({
    message: '标题不能为空',
    context: {
      i18n: i18nValidationNamespace
    }
  })
  title: string;

  tip: string;

  @IsNotEmpty({
    message: '类型不能为空',
    context: {
      i18n: i18nValidationNamespace
    }
  })
  type: string;

  @ValidateIf((o) => o.value !== undefined)
  value?: string;

  @ValidateIf((o) => o.content !== undefined)
  content?: string;

  rule: string;
  extend: string;
  allow_del: number;
  weigh: number;
}
