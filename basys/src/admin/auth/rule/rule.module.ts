import { Module } from '@nestjs/common';
import { AuthRuleController } from './rule.controller';
import { AuthRuleService } from './rule.service';
import { AdminRuleCrudService } from './rule.crud';

@Module({
  controllers: [AuthRuleController],
  providers: [AuthRuleService, AdminRuleCrudService]
})
export class AuthRuleModule {}
