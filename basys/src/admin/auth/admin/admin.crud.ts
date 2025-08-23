import { Injectable } from "@nestjs/common";
import { PrismaService, BaseCrudService } from "../../../core";

@Injectable()
export class AdminCrudService extends BaseCrudService {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }
    public async init() {
        this.model = this.prisma.baAdmin;
        super.init();
    }
}
