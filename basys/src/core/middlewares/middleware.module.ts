import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  AssembleTreeMiddleware,
  RequestTimeMiddleware,
  RouteInfoMiddleware,
} from '.';

@Module({})
export class CoreMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestTimeMiddleware, RouteInfoMiddleware, AssembleTreeMiddleware)
      .forRoutes('*'); // 应用到所有路由
  }
}
