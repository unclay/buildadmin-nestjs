import { Module } from '@nestjs/common';
// core
import { DatabaseModule } from '../../../core/database/database.module';
// modules
import { AuthModule } from '../../../modules/auth/auth.module';
// local
import { AuthGroupController } from './group.controller';
import { AuthGroupService } from './group.service';
import { AdminGroupCrudService } from './group.crud';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AuthGroupController],
  providers: [AuthGroupService, AdminGroupCrudService],
})
export class AuthGroupModule { }
