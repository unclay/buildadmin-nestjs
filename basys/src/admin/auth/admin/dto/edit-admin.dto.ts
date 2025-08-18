import { IsEnum, IsNumber, IsOptional, IsString, Matches } from "class-validator";
import { CreateAdminDto } from "./create-admin.dto";

export class EditAdminDto extends CreateAdminDto {
    @IsNumber({}, { message: 'ID必须为数字' })
    id: number

    @IsOptional()
    @IsString()
    @Matches(/^(?!.*[&<>"'\n\r]).{6,32}$/, {
        message: '密码不能包含特殊字符 &<>"\'\\n\\r，长度6-32',
    })
    password: string;

    @IsOptional()
    @IsEnum(['disabled', 'enabled'], { message: 'status必须为disabled或enabled' })
    status: 'disabled' | 'enabled'
}