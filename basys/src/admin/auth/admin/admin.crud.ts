import { Injectable } from '@nestjs/common';
// core
import { BaseCrudService } from '../../../core';

@Injectable()
export class AdminCrudService extends BaseCrudService {
  constructor() {
    super();
  }
  public async init() {
    this.model = this.prisma.baAdmin;
    super.init();
  }
}
