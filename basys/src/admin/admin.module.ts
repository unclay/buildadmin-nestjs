import { Module } from '@nestjs/common';
import { IndexModule } from './index/index.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { AuthAdminLogModule } from './auth/log/log.module';
import { RoutineModule } from './routine/routine.module';

@Module({
  imports: [
    IndexModule,
    DashboardModule,
    AuthModule,
    AuthAdminLogModule,
    RoutineModule,
  ],
})
export class AdminModule {}
