import { Injectable } from "@nestjs/common";
import { PrismaService, BaseCrudService } from "../../../core";

@Injectable()
export class AdminGroupCrudService extends BaseCrudService {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma, prisma.baAdminGroup['name']);
    }
}