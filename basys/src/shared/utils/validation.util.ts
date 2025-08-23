// common/utils/validation.util.ts
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export async function validateDto<T extends object>(
  dtoClass: new () => T,
  data: any,
): Promise<T> {
  const dtoInstance = plainToInstance(dtoClass, data);
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    const message = errors
      .map(error => Object.values(error.constraints || {}))
      .flat()
      .join(', ');
    throw new BadRequestException(message);
  }

  return dtoInstance;
}