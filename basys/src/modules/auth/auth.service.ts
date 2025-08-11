import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { pick } from 'lodash';
import { BaAuth } from '../../extend/ba/Auth';
import { TokenService } from './token.service';
import { PrismaService } from '../../core/services/prisma.service';
import { ApiException } from '../../core/exceptions/api.exception';

@Injectable()
export class AuthService extends BaAuth {
    // 刷新 token 过期时间
    refreshTokenKeepTime = 2592000;
    // 允许返回的字段
    allowFields = ['id', 'username', 'nickname', 'avatar', 'last_login_time'];
    
    /**
     * 需要登录时/无需登录时的响应状态代码
     */
    LOGIN_RESPONSE_CODE = 303;

    /**
     * 需要登录标记 - 前台应清理 token、记录当前路由 path、跳转到登录页
     */
    NEED_LOGIN = 'need login';

    /**
     * 已经登录标记 - 前台应跳转到基础路由
     */
    LOGGED_IN = 'logged in';

    /**
     * token 入库 type
     */
    TOKEN_TYPE = 'admin';

    constructor(
        private jwtService: JwtService,
        public prisma: PrismaService,
        private configService: ConfigService,
        private tokenService: TokenService,
    ) {
        super(prisma);
    }
    
    public async checkToken(token: string) {
        if (!token) {
            throw new ApiException('Token Not Found', null, HttpStatus.UNAUTHORIZED);
        }
        const tokenDB = await this.tokenService.getTokenWithDB(token);
        if (!tokenDB) {
            throw new ApiException('Token Record Not Found', null, HttpStatus.UNAUTHORIZED);
        }
    }

    async loginWithRequest(req: Request, username: string, password: string) {
        // 需要先将 Request 转换为 any 类型来访问 body 属性
        return this.login(username, password, (req as any).body?.keep, req.ip);
    }
    // 校验用户，并返回用户信息
    async login(username: string, password: string, keep: boolean, ip: string) {
        const admin = await this.prisma.baAdmin.findUnique({
            where: {
                username,
            },
        });
        if (!admin) {
            throw new ApiException('Username is incorrect');
        }
        if (admin.status == 'disable') {
            throw new ApiException('Account disabled');
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
                throw new ApiException('Please try again after 1 day');
            }
        }

        // 密码检查
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            this.loginFailed(admin, ip);
            throw new ApiException('Password is incorrect');
        }

        // 清理 token
        if (this.configService.get('buildadmin.admin_sso')) {
            // this.tokenService.clear(this.TOKEN_TYPE, admin.id);
            // this.tokenService.clear(this.TOKEN_TYPE + '-refresh', admin.id);
        }

        if (keep) {
            // this.setRefreshToken(this.refreshTokenKeepTime);
        }

        const token = this.jwtService.sign({
            user_id: admin.id,
            type: this.TOKEN_TYPE,
        });
        this.loginSuccessful(admin, ip, token);

        delete admin.password;
        return {
            ...pick(admin, this.allowFields),
            token,
        };
    }

    /**
     * 管理员登录失败
     * @return bool
     */
    async loginFailed(admin: any, ip: string) {
        await this.prisma.baAdmin.update({
            where: { id: admin.id },
            data: {
                login_failure: admin.login_failure + 1,
                last_login_time: Math.floor(Date.now() / 1000),
                last_login_ip: ip
            },
        });
    }

    async loginSuccessful(admin: any, ip: string, token: string) {
        await this.prisma.baAdmin.update({
            where: { id:admin.id },
            data: {
                login_failure: 0,          // 重置登录失败次数
                last_login_time: Math.floor(Date.now() / 1000),
                last_login_ip: ip
            },
        });
        await this.prisma.baToken.create({
            data: {
                token,
                type: this.TOKEN_TYPE,
                user_id: admin.id,
                create_time: Math.floor(Date.now() / 1000),
                expire_time: Math.floor(Date.now() / 1000) + this.configService.get('buildadmin.admin_token_keep_time'),
            },
        });
    }

    getMenus(uid: number) {
        return super.getMenus(uid);
    }
}
