import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query } from "@nestjs/common";
import { AuthAdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { ApiException } from "src/core/exceptions/api.exception";
import { EditAdminDto } from "./dto/edit-admin.dto";

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
    async getIndex(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
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

    /**
     * 获取单个管理员信息
     * @param id 
     * @returns 
     */
    @Get('edit')
    async getEdit(@Query('id', ParseIntPipe) id: number) {
        const record = await this.authAdminService.getItem(id);
        if (!record) {
            throw new ApiException('Record not found')
        }
        return {
            row: record
        };
    }

    /**
     * 更新单个管理员信息
     * @param id
     * @returns 
     */
    @Post('edit')
    async postEdit(@Body() body: EditAdminDto) {
        return await this.authAdminService.postEdit(body);
    }
}
