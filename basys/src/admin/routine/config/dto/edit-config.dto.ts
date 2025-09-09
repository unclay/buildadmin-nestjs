import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';
import { i18nValidationNamespace } from '../../../../core';

export class RoutineConfigEditDto {
  [key: string]: any;

  @ValidateIf((o) => Object.keys(o).length === 0)
  @IsNotEmpty({ message: i18nValidationNamespace('common', 'Parameter {s} can not be empty', { s: '' }) })
  _notEmpty?: never;
}
