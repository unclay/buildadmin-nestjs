import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Request } from 'express';
// shared
import { ApiResponse, extractTokenFromRequest } from "../../shared";
// local
import { LoginService } from "./login.service";
import { TokenService } from "./token.service";
import { CoreI18nService } from "../../core";

@Injectable()
export class LoginJwtStrategy extends PassportStrategy(Strategy, 'auth-jwt') {
  constructor(
    private readonly configService: ConfigService, 
    @Inject(forwardRef(() => LoginService))
    private loginService: LoginService, 
    private tokenService: TokenService,
    @Inject(forwardRef(() => CoreI18nService)) private i18n: CoreI18nService,
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: (req: Request) => {
        return extractTokenFromRequest(req);
      },
      ignoreExpiration: false,
      secretOrKey: configService.get('app.jwt_secret'), // 这是解密的密钥，要和加密的密钥一致（加密在login.module.ts）
    });
  }

  async validate(req: Request, payload: any) {
    const isLogin = await this.loginService.isLogin(req);
    if (!isLogin) {
      throw ApiResponse.error(this.i18n.t('auth', 'Please login first'), {
        'type': this.loginService.NEED_LOGIN
      }, this.loginService.LOGIN_RESPONSE_CODE);
    }
    const admin = await this.tokenService.getUser(payload.user_id);
    if (!admin) {
      return null;
    }
    return {
      strategy: 'auth-jwt',
      ...admin,
      password: undefined, // del password
    };
  }
}
