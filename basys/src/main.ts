import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor, AdminLogInterceptor, SerializerInterceptor } from './core';
import { GlobalAuthGuard } from './modules/auth/global-auth.guard';
import { HttpExceptionFilter } from './core/filters/response.filter';

async function bootstrap() {
  // 中间件 → 守卫 → 拦截器 → 控制器
  const app = await NestFactory.create(AppModule);
  // 跨域
  app.enableCors({
    origin: 'http://localhost:1818',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // 全局校验
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // 全局拦截器
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new SerializerInterceptor(),
    new AdminLogInterceptor(),
  );
  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );
  // 全局守卫
  app.useGlobalGuards(new GlobalAuthGuard(app.get(Reflector)));
  await app.listen(process.env.PORT ?? 18000, '0.0.0.0');
}
bootstrap();
