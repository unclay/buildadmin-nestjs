import { 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  MaxLength, 
  Matches,
  IsBoolean,
  IsOptional,
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
    message: '密码长度需在6-32位之间，且不能包含特殊字符 &<>"\' 和换行符'
  })
  password: string;

  @IsOptional()
  @IsBoolean({ message: 'keep字段必须是布尔值' })
  keep: boolean;
}