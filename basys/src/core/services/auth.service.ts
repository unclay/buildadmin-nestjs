import { randomUUID } from 'crypto';
import { Injectable, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { ConfigService } from "@nestjs/config";
import { TokenService } from "./token.service";
import { RequestContext } from './request-context.service';
import { BaAuth } from 'src/extend/ba/Auth';
import * as bcrypt from 'bcrypt';
import { pick } from 'lodash';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService extends BaAuth implements OnModuleInit {
    
    // 登录 token 类型
    TOKEN_TYPE = 'admin';
    // 登录 token
    token = '';
    // 刷新 token
    refreshToken = '';
    // 刷新 token 过期时间
    refreshTokenKeepTime = 2592000;
    // 登录用户信息
    model = null;
    // 允许输出的字段
    allowFields = ['id', 'username', 'nickname', 'avatar', 'last_login_time'];
    // 登录状态
    loginEd = false;

    constructor(
        public prisma: PrismaService,
        private configService: ConfigService,
        private tokenService: TokenService,
        private requestContext: RequestContext,
        private jwtService: JwtService,
    ) {
        super(prisma);
    }
    async onModuleInit() {
        this.init();
    }
    async init() {
        // const token = this.tokenService.get(this.TOKEN_TYPE);
    }
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
            ...pick(admin, this.allowFields),
            token: this.getToken(),
            refresh_token: this.getRefreshToken(),
        };
    }
    async login(username: string, password: string, keep: boolean) {
        this.model = await this.prisma.baAdmin.findUnique({
            where: {
                username,
            },
        });
        const admin = this.model;
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
            this.tokenService.set(this.token, this.TOKEN_TYPE, this.model.id, this.refreshTokenKeepTime);
        }
        await this.prisma.baAdmin.update({
            where: { id: this.model.id },
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
        this.tokenService.set(this.refreshToken, this.TOKEN_TYPE + '-refresh', this.model.id, keepTime);
    }

    /**
     * 是否是超级管理员
     * @throws Throwable
     */
    async isSuperAdmin(): Promise<boolean> {
        const ruleIds = await this.getRuleIds();
        return ruleIds.includes('*');
    }

    async getRuleIds(uid?: number): Promise<string[]> {
        return await super.getRuleIds(uid || this.model.id);
    }
    async getMenus(uid?: number): Promise<string[]> {
        return await super.getMenus(uid || this.model.id);
    }


    /**
     * 校验用户
     */
    // 校验用户，并返回用户信息
    async validateUser(username: string, password: string) {
        const user = await this.prisma.baAdmin.findUnique({
            where: {
                username,
            },
        });
        if (!user) return null;
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;
        delete user.password;
        return pick(user, this.allowFields);
    }
    // 生成 token
    sign(user: any) {
        // 签名字段只要几个关键字段，太多字段会导致token长度过长，浪费网络资源
        // 这里只用了uid、username
        const payload = { id: user.id, username: user.username };
        return {
            refresh_token: '',
            token: this.jwtService.sign(payload),
        };
    }
}