import { Module } from "@nestjs/common";
import { AdminAuthAdminController } from "./admin.controller";
import { AdminAuthAdminService } from "./admin.service";

@Module({
    controllers: [AdminAuthAdminController],
    providers: [AdminAuthAdminService],
    exports: [],
})
export class AdminAuthAdminModule {}
