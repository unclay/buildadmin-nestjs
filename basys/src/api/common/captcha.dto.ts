import { IsBoolean, IsString } from 'class-validator';

export class ClickCaptchaDto {
  @IsString({ message: 'id不能为空' })
  id: string;

  @IsString({ message: 'info不能为空' })
  info: string;

  @IsBoolean({ message: 'unset必须是布尔值' })
  unset: boolean;
}
