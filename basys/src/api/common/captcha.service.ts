// service demo
import { Injectable } from '@nestjs/common';
import { ClickCaptchaData, CoreClickCaptchaService } from '../../core';

@Injectable()
export class CommonCaptchaService {
  constructor(
    // private readonly prisma: PrismaService,
    private readonly captchaService: CoreClickCaptchaService,
  ) {}

  create(id: string): Promise<ClickCaptchaData> {
    return this.captchaService.create(id);
  }

  check(id: string, info: string, unset: boolean): Promise<boolean> {
    return this.captchaService.check(id, info, unset);
  }
}
