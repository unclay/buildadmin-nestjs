import { Controller, Get, Query } from '@nestjs/common';
import { AuthGroupService } from './group.service';

@Controller('admin/auth.group')
export class AuthGroupController {
    constructor(private authGroupService: AuthGroupService) {}
    @Get('index')
    async getIndex() {
        return this.authGroupService.getOptions();
    }
}
