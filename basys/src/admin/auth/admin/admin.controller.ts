import { Controller, Get, Query } from "@nestjs/common";
import { AdminAuthAdminService } from "./admin.service";

@Controller('admin/auth.admin')
export class AdminAuthAdminController {
    constructor(private adminAuthAdminService: AdminAuthAdminService) {}
    @Get('index')
    async getIndex(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return this.adminAuthAdminService.getList(page, limit);
    }
}
