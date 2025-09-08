import { Global, Module } from "@nestjs/common";
import { CoreMiddlewareModule } from "./middlewares/middleware.module";
import { DatabaseModule } from "./database/database.module";
import { CoreCaptchaModule } from "./services/captcha.module";
import { CoreI18nModule } from "./i18n/i18n.module";
import { CoreServiceModule } from "./services/service.module";


@Global()
@Module({
  imports: [DatabaseModule, CoreMiddlewareModule, CoreCaptchaModule, CoreI18nModule, CoreServiceModule],
  providers: [],
  exports: [DatabaseModule, CoreCaptchaModule, CoreI18nModule, CoreServiceModule],
})
export class CoreModule { }
