import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestConfigModule } from './config/config.module';
import { AdminModule } from './admin/admin.module';
import { ApiModule } from './api/api.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [NestConfigModule, CoreModule, AdminModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
