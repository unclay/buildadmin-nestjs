import { Module } from '@nestjs/common';
// core
import { DatabaseModule } from '../../core';
// local
import { AdminLogService } from './admin-log.service';

@Module({
  imports: [DatabaseModule],
  providers: [AdminLogService],
  exports: [AdminLogService],
})
export class AdminLogModule { }
