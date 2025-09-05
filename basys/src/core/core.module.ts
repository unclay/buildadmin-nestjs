import { Global, Module } from "@nestjs/common";
import { CoreMiddlewareModule } from "./middlewares/middleware.module";
import { DatabaseModule } from "./database/database.module";
import { CoreCaptchaModule } from "./services/captcha.module";

@Global()
@Module({
  imports: [DatabaseModule, CoreMiddlewareModule, CoreCaptchaModule],
  providers: [],
  exports: [DatabaseModule, CoreCaptchaModule],
})
export class CoreModule { }
