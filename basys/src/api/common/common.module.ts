import { Module } from '@nestjs/common';
import { ClickCaptchaController } from './click-captcha.controller';

@Module({
    controllers: [ClickCaptchaController],
})
export class CommonModule {}
