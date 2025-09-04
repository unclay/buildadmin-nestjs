import { Module } from '@nestjs/common';
// core
import { DatabaseModule } from '../../../core';
// modules
import { AuthModule } from '../../../modules';
// local
import { AuthRuleController } from './rule.controller';
import { AuthRuleService } from './rule.service';
import { AdminRuleCrudService } from './rule.crud';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AuthRuleController],
  providers: [AuthRuleService, AdminRuleCrudService],
})
export class AuthRuleModule { }
