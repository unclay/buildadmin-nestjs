import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
// local
import { AuthAdminLogService } from './log.service';
import {
  AuthAdminLogAddDto,
  AuthAdminLogDelDto,
  AuthAdminLogEditDto,
  AuthAdminLogQueryDto,
} from './dto';

@Controller('admin/auth.adminlog')
export class AuthAdminLogController {
  constructor(private logService: AuthAdminLogService) {}
  // 增删改查
  @Post('add')
  async add(@Body() body: AuthAdminLogAddDto) {
    return await this.logService.add(body);
  }

  @Delete('del')
  async del(@Query() query: AuthAdminLogDelDto) {
    return await this.logService.del(query);
  }

  @Get('edit')
  async getEdit(@Query('id', ParseIntPipe) id: number) {
    return await this.logService.getEdit(id);
  }

  @Post('edit')
  async postEdit(@Body() body: AuthAdminLogEditDto) {
    return await this.logService.postEdit(body);
  }

  @Get('index')
  async index(@Query() query: AuthAdminLogQueryDto) {
    return await this.logService.index(query);
  }
}
