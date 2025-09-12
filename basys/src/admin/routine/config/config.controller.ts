import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { RoutineConfigService } from './config.service';
import {
  RoutineConfigAddDto,
  RoutineConfigDelDto,
  RoutineConfigEditDto,
} from './dto';

@Controller('admin/routine.config')
export class RoutineConfigController {
  constructor(private configService: RoutineConfigService) {}
  // 增删改查
  @Post('add')
  async add(@Body() body: RoutineConfigAddDto) {
    return await this.configService.add(body);
  }

  @Delete('del')
  async del(@Query() query: RoutineConfigDelDto) {
    return await this.configService.del(query);
  }

  @Get('edit')
  async getEdit(@Query('id', ParseIntPipe) id: number) {
    return await this.configService.getEdit(id);
  }

  @Post('edit')
  async postEdit(@Body() body: RoutineConfigEditDto) {
    return await this.configService.postEdit(body);
  }

  @Get('index')
  async index() {
    return await this.configService.index();
  }
}
