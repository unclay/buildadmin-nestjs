import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { Request } from 'express';

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
    constructor(private authService: AuthService) {
        // 可自定义字段名，默认 username/password
        super({
            passReqToCallback: true, // 关键：允许将请求对象传递给 validate 方法
            usernameField: 'username',
            passwordField: 'password',
        });
    }
    async validate(req: Request, username: string, password: string) {
        // 校验逻辑交给service处理，返回校验结果
        const user = await this.authService.loginWithRequest(req, username, password);
        if (!user) {
            throw new UnauthorizedException('用户名或密码错误');
        }
        const token = this.authService.sign(user);
        return {
            // strategy: 'auth-local',
            ...user,
            ...token,
        };
    }
}