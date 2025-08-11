import { Module } from '@nestjs/common';
import { AuthGroupController } from './group.controller';
import { AuthGroupService } from './group.service';

@Module({
  controllers: [AuthGroupController],
  providers: [AuthGroupService]
})
export class AuthGroupModule {}
