import {
  IsString,
  IsEmail,
  IsArray,
  IsMobilePhone,
  Matches,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @Matches(/^[a-zA-Z][a-zA-Z0-9_]{2,15}$/, {
    message: '用户名必须以字母开头，且只能包含字母、数字和下划线，长度2-15',
  })
  username: string;

  @IsString()
  @IsNotEmpty({ message: '昵称不能为空' })
  nickname: string;

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Matches(/^(?!.*[&<>"'\n\r]).{6,32}$/, {
    message: '密码不能包含特殊字符 &<>"\'\\n\\r，长度6-32',
  })
  password: string;

  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsOptional()
  @IsMobilePhone('zh-CN', {}, { message: '手机号格式不正确' })
  mobile: string;

  @IsArray({ message: '分组必须是一个数组' })
  @IsNotEmpty({ message: '分组不能为空' })
  group_arr: string[];
}