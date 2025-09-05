import { Module } from "@nestjs/common";
import { CoreCaptchaService } from "./captcha.service";
import { CoreClickCaptchaService } from "./click-captcha.service";

@Module({
  imports: [],
  providers: [CoreCaptchaService, CoreClickCaptchaService],
  exports: [CoreCaptchaService, CoreClickCaptchaService]
})
export class CoreCaptchaModule { }
