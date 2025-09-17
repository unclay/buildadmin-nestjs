import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './modules';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  @Public()
  @HttpCode(204)
  getHealth(): void {
    // 健康检查接口，返回 204 状态码
  }
}
