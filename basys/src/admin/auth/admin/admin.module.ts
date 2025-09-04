import { Module } from "@nestjs/common";
// core
import { DatabaseModule } from "../../../core";
// modules
import { AuthModule } from "../../../modules";
// local
import { AuthAdminController } from "./admin.controller";
import { AuthAdminService } from "./admin.service";
import { AdminCrudService } from "./admin.crud";

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AuthAdminController],
  providers: [AuthAdminService, AdminCrudService],
})
export class AuthAdminModule {}
