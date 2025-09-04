import { Module } from "@nestjs/common";
import { AdminLogModule } from "./log";
import { LoginModule } from "./auth";

@Module({
  imports: [AdminLogModule, LoginModule],
  exports: [AdminLogModule, LoginModule],
})
export class ModulesModule { }
