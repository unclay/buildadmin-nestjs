import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestConfigModule } from './config/config.module';
import { AdminModule } from './admin/admin.module';
import { ApiModule } from './api/api.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { ModulesModule } from './modules/modules.module';
import { AdminLogInterceptor } from './core';

@Module({
  // 从左到右
  imports: [NestConfigModule, CoreModule, AdminModule, ApiModule, AuthModule, ModulesModule],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局拦截器，从 core 提取出来
    {
        provide: APP_INTERCEPTOR,
        useClass: AdminLogInterceptor,
    },
  ],
  exports: [AuthModule],
})
export class AppModule {}
