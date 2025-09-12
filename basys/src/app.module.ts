import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestConfigModule } from './config/config.module';
import { AdminModule } from './admin/admin.module';
import { ApiModule } from './api/api.module';
import { CoreModule } from './core/core.module';
import { ModulesModule } from './modules/modules.module';

@Module({
  // 从左到右
  imports: [
    NestConfigModule,
    CoreModule,
    ModulesModule,
    ApiModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
