import { Module } from '@nestjs/common';
// core
import { DatabaseModule } from '../../../core';
// modules
import { AuthModule } from '../../../modules';
// local
import { AuthAdminLogController } from './log.controller';
import { AuthAdminLogService } from './log.service';
import { AdminLogCrudService } from './log.crud';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AuthAdminLogController],
  providers: [AuthAdminLogService, AdminLogCrudService],
})
export class AuthAdminLogModule { }
