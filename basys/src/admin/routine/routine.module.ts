import { Module } from '@nestjs/common';
import { RoutineConfigModule } from './config/config.module';
import { RoutineAdmininfoModule } from './admininfo/admininfo.module';

@Module({
  imports: [RoutineConfigModule, RoutineAdmininfoModule],
})
export class RoutineModule {}
