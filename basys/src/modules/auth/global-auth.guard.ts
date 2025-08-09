import { Reflector } from '@nestjs/core';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './auth.decorator';

@Injectable()
export class GlobalAuthGuard extends AuthGuard('auth-jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 属性覆盖：方法属性覆盖类属性
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果是公共路由，直接返回 true
    if (isPublic) {
      return true;
    }

    // 否则，执行默认的认证逻辑（jwt.strategy.ts）
    return super.canActivate(context);
  }
}