import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
// core
import { DatabaseModule } from '../../core';
// local
import { AuthService, LoginService, LoginJwtStrategy, LoginLocalStrategy, TokenService, AuthGuard } from './';

// 外部权限判断模块
@Module({
  imports: [DatabaseModule],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }

// 登录专用模块
@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('app.jwt_secret'), // 这是加密的密钥，要和解密的密钥一致（解密在jwt.strategy.ts）
          signOptions: { expiresIn: configService.get('app.jwt_expires_in') },
        }
      },
    })
  ],
  providers: [LoginJwtStrategy, LoginLocalStrategy, AuthGuard, LoginService, TokenService],
  exports: [AuthGuard, LoginLocalStrategy]
})
export class LoginModule { }
