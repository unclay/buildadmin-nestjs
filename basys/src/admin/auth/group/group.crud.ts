import { Injectable } from "@nestjs/common";
// core
import { BaseCrudService } from "../../../core";

@Injectable()
export class AdminGroupCrudService extends BaseCrudService {
  constructor() {
    super();
  }
  public async init() {
    this.model = this.prisma.baAdminGroup;
    super.init();
  }
}