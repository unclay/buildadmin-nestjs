import { Injectable } from "@nestjs/common";
import { BaseCrudService, PrismaService } from "../../../core";

@Injectable()
export class AdminRuleCrudService extends BaseCrudService {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }
    public async init() {
        this.model = this.prisma.baAdminRule;
        super.init();
    }
}
