import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { extractTokenFromRequest } from '../../shared';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { ApiResponse } from '../../shared/api';
import { PrismaService } from '../../core/database';

/**
 * 本地策略
 * 1. 从请求体中提取 username/password
 * 2. 校验 username/password 是否正确
 * 3. 如果正确，将用户信息挂载到请求对象上
 * 4. 如果错误，抛出异常
 * 5. 校验通过后，将用户信息挂载到请求对象上，后续可以在控制器中通过 @Request() 装饰器获取
 */
@Injectable()
export class AuthLocalStrategy extends PassportStrategy(Strategy, 'auth-local') {
    constructor(private authService: AuthService, private jwtService: JwtService, private configService: ConfigService, private tokenService: TokenService, private prisma: PrismaService) {
        // 可自定义字段名，默认 username/password
        super({
            passReqToCallback: true, // 关键：允许将请求对象传递给 validate 方法
            usernameField: 'username',
            passwordField: 'password',
        });
    }
    async validate(req: Request, username: string, password: string) {
        let isLogin = false;
        try {
            // 获取token
            const token = extractTokenFromRequest(req);
            // token是否有效
            await this.authService.checkToken(token);
            // 没有异常抛出，说明能正常获取用户信息
            isLogin = true;
        } catch (error) {
            // token 异常，当做未登录处理，继续后续逻辑
            // console.log(error, 'token 异常');
        }
        if (isLogin) {
            throw ApiResponse.error('You have already logged in. There is no need to log in again~', {
                type: this.authService.LOGGED_IN
            }, this.authService.LOGIN_RESPONSE_CODE);
        }
        
        // 校验逻辑交给service处理，返回校验结果
        const user = await this.authService.loginWithRequest(req, username, password);
        return user;
    }
}