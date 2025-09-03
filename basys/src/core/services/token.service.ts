import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database';

@Injectable()
export class TokenService {
    constructor(private prisma: PrismaService) {}
    async set(token: string, type: string, user_id: number, expire: number = null) {
        return this.prisma.baToken.create({
            data: {
                token,
                type,
                user_id,
                create_time: new Date(),
                expire_time: expire ? new Date(Date.now() + expire * 1000) : null,
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
        if (tokenInfo.expire_time && tokenInfo.expire_time.getTime() < Date.now()) {
            return false;
        }
        return true;
    }
}
