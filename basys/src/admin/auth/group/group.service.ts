import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/services/prisma.service';

@Injectable()
export class AuthGroupService {
    constructor(private prisma: PrismaService) {}
    async getOptions() {
        // /admin/auth.Group/index?select=true&quickSearch=&isTree=true&absoluteAuth=1&uuid=_226043698171754924747730&page=1&initKey=id
        const list = await this.prisma.baAdminGroup.findMany();
        return {
            options: list,
        }
    }
}
