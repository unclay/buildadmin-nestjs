import { Controller, ExecutionContext, Get, ParseIntPipe, Query } from '@nestjs/common';
import { AuthGroupService } from './group.service';
import { AuthGroupIndexQueryDto } from './group.dto';
import { CoreAuthService } from '../../../core/services/auth.service';

@Controller('admin/auth.group')
export class AuthGroupController {
    constructor(private authGroupService: AuthGroupService, private coreAuthService: CoreAuthService) {}
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

    @Get('edit')
    async edit(@Query('id', ParseIntPipe) id: number) {
        return await this.authGroupService.edit(id);
    }
}
