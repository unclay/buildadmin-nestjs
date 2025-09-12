import { Module } from '@nestjs/common';
import { RoutineConfigController } from './config.controller';
import { RoutineConfigCrudService } from './config.crud';
import { RoutineConfigService } from './config.service';
import { AuthModule } from '../../../modules';


@Module({
  imports: [AuthModule],
  controllers: [RoutineConfigController],
  providers: [RoutineConfigCrudService, RoutineConfigService]
})
export class RoutineConfigModule { }
