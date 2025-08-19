import { Body, Controller, Get, Post, Query } from "@nestjs/common";
// core
import { CoreAuthService } from "../../../core/services/auth.service";
import { AuthRuleService } from "./rule.service";
/// local
import { AuthRuleIndexQueryDto } from "./dto/query.dto";
import { AuthRuleEditDto } from "./dto/edit-rule.dto";

@Controller('admin/auth.rule')
export class AuthRuleController {
    constructor(private ruleService: AuthRuleService, private coreAuthService: CoreAuthService) {}
    @Get('index')
    async index(@Query() query: AuthRuleIndexQueryDto) {
        if (query.select) {
            return await this.ruleService.select();
        }
        return {
            list: await this.ruleService.getMenus(),
            remark: await this.coreAuthService.getRouteRemark(),
        }
    }

    @Post('edit')
    async edit(@Body() body: AuthRuleEditDto) {
        return body;
    }
}