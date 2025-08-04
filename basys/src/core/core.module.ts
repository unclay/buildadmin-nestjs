import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./services/prisma.service";

@Global()
@Module({
    imports: [PrismaService],
    controllers: [],
    providers: [],
    exports: [],
})
export class CoreModule {}
