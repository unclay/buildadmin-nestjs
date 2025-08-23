import { Module } from '@nestjs/common';
import { AuthGroupController } from './group.controller';
import { AuthGroupService } from './group.service';
import { AdminGroupCrudService } from './group.crud';

@Module({
  controllers: [AuthGroupController],
  providers: [AuthGroupService, AdminGroupCrudService]
})
export class AuthGroupModule {}
