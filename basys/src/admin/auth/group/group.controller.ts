import { Body, Controller, Delete, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
// core
import { CoreAuthService } from '../../../core/services/auth.service';
// local
import { AuthGroupAddDto, AuthGroupDelDto, AuthGroupEditDto, AuthGroupIndexQueryDto } from './dto';
import { AuthGroupService } from './group.service';

@Controller('admin/auth.group')
export class AuthGroupController {
    constructor(private authGroupService: AuthGroupService, private coreAuthService: CoreAuthService) {}
    // 增删改查
    @Post('add')
    async postAdd(@Body() body: AuthGroupAddDto) {
        return await this.authGroupService.postAdd(body);
    }

    @Delete('del')
    async del(@Query() query: AuthGroupDelDto) {
        return this.authGroupService.del(query);
    }

    @Get('edit')
    async getEdit(@Query('id', ParseIntPipe) id: number) {
        return await this.authGroupService.getEdit(id);
    }

    @Post('edit')
    async postEdit(@Body() body: AuthGroupEditDto) {
        return await this.authGroupService.postEdit(body);
    }

    @Get('index')
    async index(@Query() query: AuthGroupIndexQueryDto) {
        // /admin/auth.Group/index?select=true&quickSearch=&isTree=true&absoluteAuth=1&uuid=_226043698171754924747730&page=1&initKey=id
        if (query.select) {
            return await this.authGroupService.select(query);
        }
        return {
            remark: await this.coreAuthService.getRouteRemark(),
            group: await this.coreAuthService.getAdminGroupIds(),
            list: await this.authGroupService.getGroups(query),
        }
    }
}
