import { Controller, Get, Query } from '@nestjs/common';
import { AuthGroupService } from './group.service';
import { AuthGroupIndexQueryDto } from './group.dto';

@Controller('admin/auth.group')
export class AuthGroupController {
    constructor(private authGroupService: AuthGroupService) {}
    @Get('index')
    async getIndex(@Query() query: AuthGroupIndexQueryDto) {
        // /admin/auth.Group/index?select=true&quickSearch=&isTree=true&absoluteAuth=1&uuid=_226043698171754924747730&page=1&initKey=id
        if (query.select) {
            return this.authGroupService.select(query);
        }

        return {
            list: this.authGroupService.getGroups(query),
            // group: this.authGroupService.adminGroups(),
            // remark: get_route_remark(),
        }
    }
}
