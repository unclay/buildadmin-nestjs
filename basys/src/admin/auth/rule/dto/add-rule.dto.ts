import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUrl, ValidateIf } from "class-validator"
// core
import { TransformToNumber } from "../../../../core/decorators/dto.decorator"

export class AuthRuleAddDto {
    @IsNotEmpty({ message: 'type 不能为空' })
    type: string

    @IsEnum(['tab', 'link', 'iframe'], { message: 'menu_type 必须是 tab,link,iframe 之一' })
    menu_type: string

    @ValidateIf(o => ['link', 'iframe'].includes(o.menu_type))
    @IsUrl({}, { 
        message: '当 menu_type 为 link 或 iframe 时，必须提供有效的 URL' 
    })
    url?: string

    @ValidateIf(o => o.menu_type === 'tab')
    @IsNotEmpty({ message: 'component 不能为空' })
    component: string

    @ValidateIf(o => o.menu_type === 'tab')
    @IsEnum(['none', 'add_rules_only', 'add_menu_only'], { message: 'extend 必须是 none,add_rules_only,add_menu_only' })
    extend: string

    @IsEnum([0, 1], { message: "keepalive 必须是0或1" })
    @TransformToNumber()
    keepalive: 0 | 1

    @IsEnum([0, 1], { message: "status 必须是0或1" })
    @TransformToNumber()
    status: 0 | 1

    @IsNotEmpty({ message: 'icon 不能为空' })
    icon: string

    @IsNumber({}, { message: 'pid必须是数字' })
    @TransformToNumber()
    pid: number

    @IsNotEmpty({ message: 'title 不能为空' })
    title: string

    @IsNotEmpty({ message: 'name 不能为空' })
    name: string

    @IsNotEmpty({ message: 'path 不能为空' })
    path: string

    @IsOptional()
    @IsNumber({}, { message: 'weigh 必须是数字' })
    @TransformToNumber()
    weigh: number
}
