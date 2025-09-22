import { Module } from '@nestjs/common';
import { RoutineAdmininfoController } from './admininfo.controller';
import { RoutineAdmininfoCrudService } from './admininfo.crud';
import { RoutineAdmininfoService } from './admininfo.service';
import { AuthModule } from '../../../modules';


@Module({
  imports: [AuthModule],
  controllers: [RoutineAdmininfoController],
  providers: [RoutineAdmininfoCrudService, RoutineAdmininfoService]
})
export class RoutineAdmininfoModule {}
