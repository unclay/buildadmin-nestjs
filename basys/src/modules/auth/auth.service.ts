import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { pick } from 'lodash';
import { BaAuth } from 'src/extend/ba/Auth';
import { PrismaService } from 'src/core/services/prisma.service';
import { Request } from 'express';

@Injectable()
export class AuthService extends BaAuth {
    // 登录 token 类型
    TOKEN_TYPE = 'admin';
    // 登录 token
    token = '';
    // 刷新 token
    refreshToken = '';
    // 刷新 token 过期时间
    refreshTokenKeepTime = 2592000;
    // 允许返回的字段
    allowFields = ['id', 'username', 'nickname', 'avatar', 'last_login_time'];
    // 登录用户信息
    model = null;
    // 登录状态
    loginEd = false;
    ip = '';

    constructor(
        private jwtService: JwtService,
        public prisma: PrismaService,
        private configService: ConfigService,
    ) {
        super(prisma);
    }
    async loginWithRequest(req: Request, username: string, password: string) {
        // 需要先将 Request 转换为 any 类型来访问 body 属性
        this.ip = req.ip;
        return this.login(username, password, (req as any).body?.keep);
    }
    // 校验用户，并返回用户信息
    async login(username: string, password: string, keep: boolean) {
        const admin = await this.prisma.baAdmin.findUnique({
            where: {
                username,
            },
        });
        this.model = admin;
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
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            this.loginFailed();
            throw new UnauthorizedException('密码错误');
        }

        // 清理 token
        if (this.configService.get('buildadmin.admin_sso')) {
            // this.tokenService.clear(this.TOKEN_TYPE, admin.id);
            // this.tokenService.clear(this.TOKEN_TYPE + '-refresh', admin.id);
        }

        // if (keep) {
        //     this.setRefreshToken(this.refreshTokenKeepTime);
        // }

        this.loginSuccessful();

        delete admin.password;
        return pick(admin, this.allowFields);
    }
    async loginSuccessful() {
        this.loginEd = true;
        if (!this.token) {
            this.token = randomUUID();
            // this.tokenService.set(this.token, this.TOKEN_TYPE, this.model.id, this.refreshTokenKeepTime);
        }
        await this.prisma.baAdmin.update({
            where: { id: this.model.id },
            data: {
                login_failure: 0,          // 重置登录失败次数
                last_login_time: Math.floor(Date.now() / 1000),
                last_login_ip: this.ip
            },
        });
    }
    /**
     * 管理员登录失败
     * @return bool
     */
    async loginFailed() {
        if (!this.model) return false;
        await this.prisma.baAdmin.update({
            where: { id: this.model.id },
            data: {
                login_failure: this.model.login_failure + 1,
                last_login_time: Math.floor(Date.now() / 1000),
                last_login_ip: this.ip
            },
        });
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
