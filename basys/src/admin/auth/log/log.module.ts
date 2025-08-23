import { Module } from '@nestjs/common';
import { AuthAdminLogController } from './log.controller';
import { AuthAdminLogService } from './log.service';
import { AdminLogCrudService } from './log.crud';


@Module({
  controllers: [AuthAdminLogController],
  providers: [AuthAdminLogService, AdminLogCrudService]
})
export class AuthAdminLogModule {}
