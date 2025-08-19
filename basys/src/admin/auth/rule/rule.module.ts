import { Module } from '@nestjs/common';
import { AuthRuleController } from './rule.controller';
import { AuthRuleService } from './rule.service';

@Module({
  controllers: [AuthRuleController],
  providers: [AuthRuleService]
})
export class AuthRuleModule {}
