import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./services/prisma.service";
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { RequestContext } from './services/request-context.service';

@Global()
@Module({
    providers: [PrismaService, TokenService, AuthService, RequestContext],
    exports: [PrismaService, TokenService, AuthService, RequestContext],
})
export class CoreModule {}
