import { Module } from '@nestjs/common';
import { AuthAdminModule } from './admin/admin.module';
import { AuthGroupModule } from './group/group.module';

@Module({
    imports: [AuthAdminModule, AuthGroupModule],
})
export class AuthModule {}
