import { Module } from '@nestjs/common';
import { IndexModule } from './index/index.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
    imports: [IndexModule, DashboardModule],
})
export class AdminModule {}
