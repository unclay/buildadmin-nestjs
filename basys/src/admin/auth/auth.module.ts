import { Module } from '@nestjs/common';
import { AuthAdminModule } from './admin/admin.module';
import { AuthGroupModule } from './group/group.module';
import { AuthRuleModule } from './rule/rule.module';

@Module({
    imports: [AuthAdminModule, AuthGroupModule, AuthRuleModule],
})
export class AuthModule {}
