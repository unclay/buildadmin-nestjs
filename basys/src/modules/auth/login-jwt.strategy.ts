import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Request } from 'express';
// shared
import { extractTokenFromRequest } from "../../shared";
// local
import { LoginService } from "./login.service";
import { TokenService } from "./token.service";

@Injectable()
export class LoginJwtStrategy extends PassportStrategy(Strategy, 'auth-jwt') {
  constructor(
    private readonly configService: ConfigService, 
    @Inject(forwardRef(() => LoginService))
    private loginService: LoginService, 
    private tokenService: TokenService
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
    const token = extractTokenFromRequest(req);
    await this.loginService.checkToken(token);
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
