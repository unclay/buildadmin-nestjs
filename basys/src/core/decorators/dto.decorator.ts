import { Transform } from 'class-transformer';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PrismaService } from '../database';
import { Prisma } from '@prisma/client';

@ValidatorConstraint({ name: 'isNumberOrString', async: false })
export class IsNumberOrStringConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string | number) {
    // 验证值是否为数字或字符串
    return typeof value === 'number' || typeof value === 'string';
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} 必须是数字或字符串类型`;
  }
}
export function IsNumberOrString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNumberOrString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNumberOrStringConstraint,
    });
  };
}

/**
 * 将字符串数字转换为数字，保持其他值不变
 */
export function TransformToNumber(options?: { array: boolean }) {
  // 转成数组
  const stringToNumber = (value: string) =>
    isNaN(Number(value)) ? value : Number(value);
  return Transform(({ value }) => {
    const needArray = options?.array ?? false;
    // 数字数组（ids）
    if (needArray) {
      if (typeof value === 'string') {
        return value.split(',').map(stringToNumber);
      } else if (typeof value === 'number') {
        return [value];
      } else if (Array.isArray(value)) {
        return value.map(stringToNumber);
      }
      return value;
    }
    // 字符转数字
    if (typeof value === 'string') {
      return stringToNumber(value);
    }
    // 字符数组转数字
    if (Array.isArray(value)) {
      return value.map((item) => {
        if (typeof item === 'string') {
          return stringToNumber(item);
        }
        return item;
      });
    }
    return value;
  });
}

export function IsUnique(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: any,
  column: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [table, column],
      options: validationOptions,
      validator: {
        async validate(value: string | number, args: ValidationArguments) {
          if (!value) {
            return true;
          }
          const [table, column] = args.constraints;
          const prisma = new PrismaService();

          const record = await prisma[table as Prisma.ModelName].findFirst({
            where: {
              [column]: value,
            },
          });
          console.log(record, 99, !record);

          return !record;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be unique`;
        },
      },
    });
  };
}
