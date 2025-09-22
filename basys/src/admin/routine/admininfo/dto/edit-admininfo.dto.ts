import { IsEmail, IsMobilePhone, IsNumber, IsOptional, IsString, Matches } from "class-validator"
// core
import { Transform } from "class-transformer";

export class RoutineAdmininfoEditDto {
  @IsNumber({}, { message: 'ID必须为数字' })
  id: number;

  @IsOptional()
  @IsString()
  nickname: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsMobilePhone('zh-CN', {}, { message: '手机号格式不正确' })
  mobile: string;

  @IsOptional()
  @IsString()
  motto: string;


  // 单一条件：头像
  @IsOptional()
  @IsString()
  avatar: string;

  // 单一条件：密码
  @IsOptional()
  @IsString()
  @Matches(/^(?!.*[&<>"'\n\r]).{6,32}$/, {
    message: '密码不能包含特殊字符 &<>"\'\\n\\r，长度6-32',
  })
  password: string;
}
