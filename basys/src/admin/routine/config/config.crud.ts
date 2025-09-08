import { Injectable } from "@nestjs/common";
import { PrismaService, BaseCrudService } from "../../../core";

@Injectable()
export class RoutineConfigCrudService extends BaseCrudService {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }
    public async init() {
    this.model = this.prisma.baAdminGroup;
    super.init();
  }
}
