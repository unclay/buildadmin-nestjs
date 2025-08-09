import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'auth-jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('app.jwt_secret'), // 这是解密的密钥，要和加密的密钥一致（加密在login.module.ts）
    });
  }

  async validate(payload: any) {
    // 模拟配对数据库
    const adminInfo = {
      id: 1,
      username: 'admin',
      password: '123456',
    };
    if (adminInfo.id === payload.id) {
      return {
        strategy: 'auth-jwt',
        ...adminInfo,
        password: undefined, // del password
      };
    }
    return null;
  }
}