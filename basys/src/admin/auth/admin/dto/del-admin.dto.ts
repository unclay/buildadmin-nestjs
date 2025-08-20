import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty } from "class-validator";

export class AuthAdminDelDto {
    @IsArray({ message: 'ids必须是一个数组' })
    @IsNotEmpty({ message: 'ids不能为空' })
    @Transform(({ value }) => {
        return typeof value === 'string' ? [parseInt(value, 10)] : value.map(str => parseInt(str, 10))
    })
    ids: number[]
}
