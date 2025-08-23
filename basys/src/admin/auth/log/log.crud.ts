import { Injectable } from "@nestjs/common";
import { PrismaService, BaseCrudService } from "../../../core";

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
