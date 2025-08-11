import { Module } from "@nestjs/common";
import { AuthAdminController } from "./admin.controller";
import { AuthAdminService } from "./admin.service";

@Module({
    controllers: [AuthAdminController],
    providers: [AuthAdminService],
    exports: [],
})
export class AuthAdminModule {}
