import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestConfigModule } from './config/config.module';
import { AdminModule } from './admin/admin.module';
import { ApiModule } from './api/api.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminAuthAdminModule } from './admin/auth/admin/admin.module';

@Module({
  imports: [NestConfigModule, CoreModule, AdminModule, ApiModule, AuthModule, AdminAuthAdminModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [AuthModule],
})
export class AppModule {}
