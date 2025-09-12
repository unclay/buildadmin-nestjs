import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(3, { message: '用户名长度不能少于3个字符' })
  @MaxLength(30, { message: '用户名长度不能超过30个字符' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @Matches(/^(?!.*[&<>"'\n\r]).{6,32}$/, {
    message: '密码长度需在6-32位之间，且不能包含特殊字符 &<>"\' 和换行符',
  })
  password: string;

  keep: boolean = false;
}

export class LoginCaptchaDto extends LoginDto {
  @IsString({ message: 'captchaId 必须是字符串' })
  @IsNotEmpty({ message: 'captchaId 不能为空' })
  captchaId: string;

  @IsString({ message: 'captchaInfo 必须是字符串' })
  @IsNotEmpty({ message: 'captchaInfo 不能为空' })
  captchaInfo: string;
}
