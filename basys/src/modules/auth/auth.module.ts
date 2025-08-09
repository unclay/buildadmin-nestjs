import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { GlobalAuthGuard } from './global-auth.guard';
import { AuthLocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('app.jwt_secret'), // 这是加密的密钥，要和解密的密钥一致（解密在jwt.strategy.ts）
        signOptions: { expiresIn: configService.get('app.jwt_expires_in') },
      }),
    })
  ],
  providers: [JwtStrategy, AuthLocalStrategy, GlobalAuthGuard, AuthService],
  exports: [GlobalAuthGuard, AuthLocalStrategy]
})
export class AuthModule {}
