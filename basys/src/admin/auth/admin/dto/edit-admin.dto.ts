import { IsEnum, IsNumber, IsOptional, IsString, Matches } from "class-validator";
import { AuthAdminAddDto } from "./";

export class AuthAdminEditDto extends AuthAdminAddDto {
    @IsNumber({}, { message: 'ID必须为数字' })
    id: number

    @IsOptional()
    @IsString()
    @Matches(/^$|^(?!.*[&<>"'\n\r]).{6,32}$/, {
        message: '密码不能包含特殊字符 &<>"\'\\n\\r，长度6-32',
    })
    password: string;

    @IsOptional()
    @IsEnum(['disable', 'enable'], { message: 'status必须为disable或enable' })
    status: 'disable' | 'enable'
}