import { randomUUID } from 'crypto';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { ConfigService } from "@nestjs/config";
import { TokenService } from "./token.service";
import { RequestContext } from './request-context.service';
import * as _ from 'lodash';

@Injectable()
export class AuthService {
    // 登录 token 类型
    TOKEN_TYPE = 'admin';
    // 登录 token
    token = '';
    // 刷新 token
    refreshToken = '';
    // 刷新 token 过期时间
    refreshTokenKeepTime = 2592000;
    // 登录用户信息
    admin = null;
    // 允许输出的字段
    allowFields = ['id', 'username', 'nickname', 'avatar', 'last_login_time'];
    // 登录状态
    loginEd = false;

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        private tokenService: TokenService,
        private requestContext: RequestContext,
    ) {}
    getToken() {
        return this.token;
    }
    getRefreshToken() {
        return this.refreshToken;
    }
    async getInfo() {
        const admin = await this.prisma.baAdmin.findUnique({
            where: {
                id: 1,
            },
        });
        return {
            ..._.pick(admin, this.allowFields),
            token: this.getToken(),
            refresh_token: this.getRefreshToken(),
        };
    }
    async login(username: string, password: string, keep: boolean) {
        this.admin = await this.prisma.baAdmin.findUnique({
            where: {
                username,
            },
        });
        const admin = this.admin;
        if (!admin) {
            throw new UnauthorizedException('用户名或密码错误');
        }
        if (admin.status == 'disable') {
            throw new UnauthorizedException('账号已禁用');
        }

        const lastLoginTime = admin.last_login_time;
        const adminLoginRetry = this.configService.get('buildadmin.admin_login_retry');

        if (adminLoginRetry && lastLoginTime) {
            // 重置失败次数
            if (admin.login_failure > 0 && Math.floor(Date.now() / 1000) - Number(lastLoginTime) >= 86400) {
                this.prisma.baAdmin.update({
                    where: {
                        id: admin.id,
                    },
                    data: {
                        login_failure: 0,
                    },
                });
            }

            if (admin.login_failure >= adminLoginRetry) {
                throw new UnauthorizedException('请1天后重试');
            }
        }


        // 密码检查
        // if (!verify_password(password, admin.password) {
        //     this.loginFailed();
        //     throw new UnauthorizedException('密码错误');
        // }

        // 清理 token
        if (this.configService.get('buildadmin.admin_sso')) {
            this.tokenService.clear(this.TOKEN_TYPE, admin.id);
            this.tokenService.clear(this.TOKEN_TYPE + '-refresh', admin.id);
        }
        console.log(1111);
        if (keep) {
            this.setRefreshToken(this.refreshTokenKeepTime);
        }
        this.loginSuccessful();
        return true;
    }
    async loginSuccessful() {
        this.loginEd = true;
        if (!this.token) {
            this.token = randomUUID();
            this.tokenService.set(this.token, this.TOKEN_TYPE, this.admin.id, this.refreshTokenKeepTime);
        }
        await this.prisma.baAdmin.update({
            where: { id: this.admin.id },
            data: {
                login_failure: 0,          // 重置登录失败次数
                last_login_time: Math.floor(Date.now() / 1000),
                last_login_ip: this.requestContext.request.ip,
            },
        });
    }

    /**
     * 设置刷新Token
     * @param int $keepTime
     */
    setRefreshToken(keepTime: number = 0): void {
        this.refreshToken = randomUUID();
        this.tokenService.set(this.refreshToken, this.TOKEN_TYPE + '-refresh', this.admin.id, keepTime);
    }
}