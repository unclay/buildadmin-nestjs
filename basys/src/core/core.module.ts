import { Module } from "@nestjs/common";
import { CoreMiddlewareModule } from "./middlewares/middleware.module";

// 移除 @Global() 装饰器，改为显式导入
@Module({
  imports: [CoreMiddlewareModule],
  exports: [],
})
export class CoreModule {}
