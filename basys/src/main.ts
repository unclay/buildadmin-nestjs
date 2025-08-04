import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 跨域
  app.enableCors({
    origin: 'http://localhost:1818',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // 全局校验
  app.useGlobalPipes(new ValidationPipe());
  // 全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 全局异常过滤器
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
