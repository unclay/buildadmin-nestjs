import { IsArray, IsNumber } from "class-validator";
import { TransformToNumber } from "src/core/decorators/dto.decorator";

export class AuthGroupDelDto {
  @IsNumber({}, { message: 'ids必须是一个数字数组', each: true })
  @IsArray({ message: 'ids必须是一个数字数组' })
  @TransformToNumber()
  ids: number[]
}
