import { Module } from "@nestjs/common";
import { AuthAdminController } from "./admin.controller";
import { AuthAdminService } from "./admin.service";
import { AdminCrudService } from "./admin.crud";

@Module({
    controllers: [AuthAdminController],
    providers: [AuthAdminService, AdminCrudService],
    exports: [],
})
export class AuthAdminModule {}
