import { Module } from '@nestjs/common';
import { IndexModule } from './index/index.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [IndexModule, DashboardModule, AuthModule],
})
export class AdminModule {}
