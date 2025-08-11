import { Controller, Get, Query } from "@nestjs/common";
import { AuthAdminService } from "./admin.service";

@Controller('admin/auth.admin')
export class AuthAdminController {
    constructor(private authAdminService: AuthAdminService) {}
    @Get('index')
    async getIndex(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return this.authAdminService.getList(page, limit);
    }
}
