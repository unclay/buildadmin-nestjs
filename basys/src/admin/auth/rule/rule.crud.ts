import { Injectable } from '@nestjs/common';
import { BaseCrudService } from '../../../core';

@Injectable()
export class AdminRuleCrudService extends BaseCrudService {
  constructor() {
    super();
  }
  public async init() {
    this.model = this.prisma.baAdminRule;
    super.init();
  }
}
