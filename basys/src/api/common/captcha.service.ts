// service demo
import { Injectable } from '@nestjs/common';
import { CoreClickCaptchaService } from '../../core';

@Injectable()
export class CommonCaptchaService {
  constructor(
    // private readonly prisma: PrismaService,
    private readonly captchaService: CoreClickCaptchaService,
  ) { }

  create(id: string): any {
    return this.captchaService.create(id);
  }

  check(id: string, info: string, unset: boolean): any {
    return this.captchaService.check(id, info, unset);
  }
}
