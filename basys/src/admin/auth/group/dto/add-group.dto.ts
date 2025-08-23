import { IsArray, IsEnum, IsNotEmpty, IsNumber } from "class-validator"
// core
import { TransformToNumber } from "../../../../core/decorators/dto.decorator"

export class AuthGroupAddDto {
    @IsNotEmpty({ message: '名称不能为空' })
    name: string

    @IsNumber({}, { message: 'pid必须是数字' })
    @TransformToNumber()
    pid: number

    @IsNumber({}, { message: 'ids必须是一个数字数组', each: true })
    @IsArray({ message: 'ids必须是一个数字数组' })
    @TransformToNumber()
    rules: number[]

    @IsEnum([0, 1], { message: "status必须是0或1" })
    @TransformToNumber()
    status: 0 | 1
}