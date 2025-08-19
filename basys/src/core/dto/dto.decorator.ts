import { Transform } from 'class-transformer';
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isNumberOrString', async: false })
export class IsNumberOrStringConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // 验证值是否为数字或字符串
    return typeof value === 'number' || typeof value === 'string';
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} 必须是数字或字符串类型`;
  }
}
export function IsNumberOrString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
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
export function TransformToNumber() {
  const stringToNumber = (value: string) => (isNaN(Number(value)) ? value : Number(value));
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return stringToNumber(value);
    }
    // 字符数组
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
