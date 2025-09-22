import { Injectable } from "@nestjs/common";
import { PrismaService, BaseCrudService } from "../../../core";

@Injectable()
export class RoutineAdmininfoCrudService extends BaseCrudService {
  constructor(protected readonly prisma: PrismaService) {
    super();
  }
  public async init() {
    this.model = this.prisma.baAdmin;
    super.init();
  }
}
