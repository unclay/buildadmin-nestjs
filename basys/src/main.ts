import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { SerializerInterceptor } from './core/interceptors/serializer.interceptor';

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
  app.useGlobalInterceptors(
    new SerializerInterceptor(),
    new ResponseInterceptor(),
  );
  await app.listen(process.env.PORT ?? 18000);
}
bootstrap();
