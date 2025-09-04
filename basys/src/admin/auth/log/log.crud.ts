import { Injectable } from "@nestjs/common";
// core
import { BaseCrudService, PrismaService } from "../../../core";

@Injectable()
export class AdminLogCrudService extends BaseCrudService {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
  public async init() {
    this.model = this.prisma.baAdminLog;
    super.init();
  }
}
