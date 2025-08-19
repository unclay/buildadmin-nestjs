import { Global, MiddlewareConsumer, Module, ExecutionContext } from "@nestjs/common";
// import { TokenService } from './services/token.service';
// import { AuthService } from './services/auth.service';
import { PrismaService } from "./services/prisma.service";
import { RequestContext } from './services/request-context.service';
import { RequestTimeMiddleware } from "./middlewares/request-time.middleware";
import { RouteInfoMiddleware } from "./middlewares/route-info.middleware";
import { AssembleTreeMiddleware } from "./middlewares/assemble-tree.middleware";
import { CoreAuthService } from "./services/auth.service";
// import { ApiExceptionFilter } from "./filters/api-exception.filter";

@Global()
@Module({
    providers: [
        // {
        //     provide: APP_FILTER,  // 使用 APP_FILTER 令牌
        //     useClass: ApiExceptionFilter,  // 绑定自定义过滤器
        // },
        PrismaService,
        CoreAuthService,
        RequestContext,
    ],
    exports: [PrismaService, CoreAuthService, RequestContext],
})
export class CoreModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RequestTimeMiddleware, RouteInfoMiddleware, AssembleTreeMiddleware)
            .forRoutes('*'); // 应用到所有路由
    }
}
