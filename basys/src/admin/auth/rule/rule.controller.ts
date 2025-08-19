import { Controller, Get } from "@nestjs/common";
import { AuthRuleService } from "./rule.service";
import { CoreAuthService } from "../../../core/services/auth.service";

@Controller('admin/auth.rule')
export class AuthRuleController {
    constructor(private ruleService: AuthRuleService, private coreAuthService: CoreAuthService) {}
    @Get('index')
    async index() {
        // if (query.select) {
        //     return await this.authGroupService.select(query);
        // }
        return {
            list: await this.ruleService.getMenus(),
            remark: await this.coreAuthService.getRouteRemark(),
        }
        // return this.ruleService.index();
    }
}