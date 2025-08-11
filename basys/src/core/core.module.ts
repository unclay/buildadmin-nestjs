import { APP_FILTER } from "@nestjs/core";
import { Global, Module } from "@nestjs/common";
// import { TokenService } from './services/token.service';
// import { AuthService } from './services/auth.service';
import { PrismaService } from "./services/prisma.service";
import { RequestContext } from './services/request-context.service';
// import { ApiExceptionFilter } from "./filters/api-exception.filter";

@Global()
@Module({
    providers: [
        // {
        //     provide: APP_FILTER,  // 使用 APP_FILTER 令牌
        //     useClass: ApiExceptionFilter,  // 绑定自定义过滤器
        // },
        PrismaService,
        RequestContext
    ],
    exports: [PrismaService, RequestContext],
})
export class CoreModule {}
