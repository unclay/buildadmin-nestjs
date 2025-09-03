import { HttpStatus, Inject, Injectable, Scope } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ApiResponse } from "../../shared/api";
import { PrismaService } from "../../core/database";

@Injectable()
export class TokenService  {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
        console.log('token service is init');
    }
    
    public async getTokenWithDB(token: string, isExpirationException = true) {
        const tokenInfo = await this.prisma.baToken.findFirst({
            where: {
                token,
            },
        });
        if (tokenInfo && isExpirationException) {
            this.tokenExpirationCheck(tokenInfo.expire_time as unknown as number);
        }
        return tokenInfo;
    }

    public createToken(token: string, type: string, user_id: number) {
        return this.prisma.baToken.create({
            data: {
                token,
                type,
                user_id,
                // create_time: Math.floor(Date.now() / 1000),
                // expire_time: Math.floor(Date.now() / 1000) + this.configService.get('buildadmin.admin_token_keep_time'),
            },
        });
    }


    private tokenExpirationCheck(expireTime: number) {
        if (expireTime && expireTime <= Math.floor(Date.now() / 1000)) {
            throw ApiResponse.error('Token expiration', null, HttpStatus.CONFLICT);
        }
    }

    getUser(user_id: number) {
        return this.prisma.baAdmin.findUnique({
            where: { id: user_id },
        });
    }

    /**
     * token转为user
     */
    async tokenToUser(token: string) {
        const payload = this.jwtService.verify(token);
        return await this.prisma.baAdmin.findUnique({
            where: { id: payload.user_id },
        });
    }
}
