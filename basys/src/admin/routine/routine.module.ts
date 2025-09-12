import { Module } from '@nestjs/common';
import { RoutineConfigModule } from './config/config.module';

@Module({
  imports: [RoutineConfigModule],
})
export class RoutineModule {}
