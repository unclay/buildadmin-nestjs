import { Global, MiddlewareConsumer, Module } from "@nestjs/common";
import { PrismaService } from "./database";
import { AssembleTreeMiddleware, RequestTimeMiddleware, RouteInfoMiddleware } from "./middlewares";
import { CoreAdminLogService, CoreAuthService } from "./services";

@Global()
@Module({
  providers: [
    // {
    //     provide: APP_FILTER,  // 使用 APP_FILTER 令牌
    //     useClass: ApiExceptionFilter,  // 绑定自定义过滤器
    // },
    PrismaService,
    CoreAuthService,
    CoreAdminLogService,
  ],
  exports: [PrismaService, CoreAuthService, CoreAdminLogService],
})
export class CoreModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestTimeMiddleware, RouteInfoMiddleware, AssembleTreeMiddleware)
      .forRoutes('*'); // 应用到所有路由
  }
}
