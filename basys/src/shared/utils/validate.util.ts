// shared/utils/validate.util.ts
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export async function validateDto<T extends object>(
  dtoClass: new () => T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
): Promise<T> {
  const dtoInstance = plainToInstance(dtoClass, data);
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    const message = errors
      .map((error) => Object.values(error.constraints || {})[0])
      .flat()
      .join(', ');
    // 减少耦合，不用 ApiResponese
    throw new BadRequestException(message);
  }

  return dtoInstance;
}
