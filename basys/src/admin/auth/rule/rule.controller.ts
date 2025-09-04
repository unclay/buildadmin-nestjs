import { Body, Controller, Delete, Get, ParseIntPipe, Post, Query } from "@nestjs/common";
// core
import { AuthService } from "../../../modules";
// local
import { AuthRuleAddDto, AuthRuleDelDto, AuthRuleEditDto, AuthRuleIndexQueryDto } from "./dto";
import { AuthRuleService } from "./rule.service";

@Controller('admin/auth.rule')
export class AuthRuleController {
  constructor(private ruleService: AuthRuleService, private coreAuthService: AuthService) { }
  // 增删改查

  @Post('add')
  async add(@Body() body: AuthRuleAddDto) {
    return await this.ruleService.add(body);
  }

  @Delete('del')
  async del(@Query() query: AuthRuleDelDto) {
    return await this.ruleService.del(query);
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

  @Get('test')
  async test() {
    return await this.ruleService.test();
  }

}