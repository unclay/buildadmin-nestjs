import { Body, Controller, Delete, Get, ParseIntPipe, Post, Query } from "@nestjs/common";
import { RoutineAdmininfoService } from "./admininfo.service";
import { RoutineAdmininfoEditDto } from "./dto";

@Controller('admin/routine.admininfo')
export class RoutineAdmininfoController {
  constructor(private admininfoService: RoutineAdmininfoService) { }
  // 增删改查
  @Post('edit')
  async postEdit(@Body() body: RoutineAdmininfoEditDto) {
    return await this.admininfoService.postEdit(body);
  }

  @Get('index')
  async index() {
    const data = await this.admininfoService.index();
    return data;
  }
}