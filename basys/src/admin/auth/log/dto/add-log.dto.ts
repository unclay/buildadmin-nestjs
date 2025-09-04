import { IsEnum, IsNotEmpty, IsNumber } from "class-validator"
// core
import { TransformToNumber } from "../../../../core";

export class AuthAdminLogAddDto {
  @IsEnum(['tab', 'link', 'iframe'], { message: 'type 必须是 tab,link,iframe 之一' })
  type: string

  @IsEnum([0, 1], { message: "keepalive 必须是0或1" })
  @TransformToNumber()
  keepalive: 0 | 1

  @IsEnum([0, 1], { message: "status 必须是0或1" })
  @TransformToNumber()
  status: 0 | 1

  @IsNumber({}, { message: 'pid必须是数字' })
  @TransformToNumber()
  pid: number

  @IsNotEmpty({ message: 'title 不能为空' })
  title: string
}
