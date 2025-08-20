import { IsArray, IsEnum, IsNotEmpty, IsNumber } from "class-validator"
// core
import { TransformToNumber } from "../../../../core/dto/dto.decorator"
// local
import { AuthGroupAddDto } from "./add-group.dto"

export class AuthGroupEditDto extends AuthGroupAddDto {
    @IsNumber({}, { message: 'id必须是数字' })
    @TransformToNumber()
    id: number
}
