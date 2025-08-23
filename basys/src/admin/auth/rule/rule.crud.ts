import { Injectable } from "@nestjs/common";
import { PrismaService, BaseCrudService } from "../../../core";

@Injectable()
export class AdminRuleCrudService extends BaseCrudService {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma, prisma.baAdminRule['name']);
    }
}
