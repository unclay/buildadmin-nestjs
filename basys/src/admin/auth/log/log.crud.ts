import { Injectable } from "@nestjs/common";
// core
import { BaseCrudService } from "../../../core";

@Injectable()
export class AdminLogCrudService extends BaseCrudService {
  constructor() {
    super();
  }
  public async init() {
    this.model = this.prisma.baAdminLog;
    super.init();
  }
}
