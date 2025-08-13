import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthAdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";

@Controller('admin/auth.admin')
export class AuthAdminController {
    constructor(private authAdminService: AuthAdminService) {}
    /**
     * 获取管理员列表
     * @param page 
     * @param limit 
     * @returns 
     */
    @Get('index')
    async getIndex(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return this.authAdminService.getList(page, limit);
    }

    /**
     * 新增管理员
     * @returns 
     */
    @Post('add')
    async postAdd(@Body() createAdminDto: CreateAdminDto) {
        return this.authAdminService.createAdmin(createAdminDto);
    }
}
