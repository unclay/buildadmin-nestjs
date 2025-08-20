import { Body, Controller, DefaultValuePipe, Delete, Get, ParseIntPipe, Post, Query } from "@nestjs/common";
// core
import { ApiException } from "../../../core/exceptions/api.exception";
// local
import { AuthAdminAddDto, AuthAdminDelDto, AuthAdminEditDto } from "./dto";
import { AuthAdminService } from "./admin.service";

@Controller('admin/auth.admin')
export class AuthAdminController {
    constructor(private authAdminService: AuthAdminService) {}
    // 增删改查

    /**
     * 新增管理员
     * @returns 
     */
    @Post('add')
    async add(@Body() body: AuthAdminAddDto) {
        return this.authAdminService.add(body);
    }

    /**
     * 删除单个管理员
     */
    @Delete('del')
    async del(@Query() query: AuthAdminDelDto) {
        return this.authAdminService.del(query);
    }

    /**
     * 获取单个管理员信息
     * @param id 
     * @returns 
     */
    @Get('edit')
    async getEdit(@Query('id', ParseIntPipe) id: number) {
        const record = await this.authAdminService.getEdit(id);
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
    async postEdit(@Body() body: AuthAdminEditDto) {
        return await this.authAdminService.postEdit(body);
    }

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
}
