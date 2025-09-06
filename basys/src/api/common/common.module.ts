import { Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
// local
import { CommonCaptchaController } from './captcha.controller';
import { CommonCaptchaService } from './captcha.service';

@Module({
  imports: [CoreModule],
  controllers: [CommonCaptchaController],
  providers: [CommonCaptchaService],
})
export class CommonModule { }
