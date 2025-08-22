import { Body, Controller, Get, ParseIntPipe, Post, Query } from "@nestjs/common";
// core
import { CoreAuthService } from "../../../core/services/auth.service";
import { AuthRuleService } from "./rule.service";
/// local
import { AuthRuleIndexQueryDto } from "./dto/query.dto";
import { AuthRuleEditDto } from "./dto/edit-rule.dto";
import { AuthRuleAddDto } from "./dto";

@Controller('admin/auth.rule')
export class AuthRuleController {
    constructor(private ruleService: AuthRuleService, private coreAuthService: CoreAuthService) {}
    @Post('add')
    async add(@Body() body: AuthRuleAddDto) {
        return await this.ruleService.add(body);
    }

    @Get('edit')
    async getEdit(@Query('id', ParseIntPipe) id: number) {
        return await this.ruleService.getEdit(id);
    }

    @Post('edit')
    async postEdit(@Body() body: AuthRuleEditDto) {
        return await this.ruleService.postEdit(body);
    }

    @Get('index')
    async index(@Query() query: AuthRuleIndexQueryDto) {
        if (query.select) {
            return await this.ruleService.select(query);
        }
        return {
            list: await this.ruleService.getMenus(query),
            remark: await this.coreAuthService.getRouteRemark(),
        }
    }

    
}