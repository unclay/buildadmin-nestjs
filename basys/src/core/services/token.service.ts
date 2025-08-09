import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class TokenService {
    constructor(private prisma: PrismaService) {}
    async set(token: string, type: string, user_id: number, expire: number = null) {
        return this.prisma.baToken.create({
            data: {
                token,
                type,
                user_id,
                create_time: Math.floor(Date.now() / 1000),
                expire_time: expire ? Math.floor(Date.now() / 1000) + expire : null,
            },
        });
    }
    async clear(type: string, user_id: number) {
        return this.prisma.baToken.deleteMany({
            where: {
                type,
                user_id,
            },  
        });
    }
    async get(type: string, token: string) {
        return this.prisma.baToken.findFirst({
            where: {
                type,
                token,
            },
        });
    }
    async check(type: string, token: string) {
        const tokenInfo = await this.get(type, token);
        if (!tokenInfo) {
            return false;
        }
        if (tokenInfo.expire_time && tokenInfo.expire_time < Math.floor(Date.now() / 1000)) {
            return false;
        }
        return true;
    }
}
