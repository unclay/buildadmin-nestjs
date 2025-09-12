import { NestFactory, Reflector } from '@nestjs/core';
// core
import {
  DateTimeInterceptor,
  ResponseInterceptor,
  SerializerInterceptor,
  HttpExceptionFilter,
  AdminLogInterceptor,
  CoreI18nService,
} from './core';
// modules
import { AdminLogService, AuthGuard } from './modules';
// local
import { AppModule } from './app.module';
import { I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  // 中间件 → 守卫 → 拦截器 → 控制器
  const app = await NestFactory.create(AppModule);
  // 跨域
  app.enableCors({
    origin: 'http://localhost:1818',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // 全局校验（支持 i18n）
  app.useGlobalPipes(new I18nValidationPipe());
  // 全局拦截器
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new SerializerInterceptor(),
    new DateTimeInterceptor(),
    new AdminLogInterceptor(app.get(AdminLogService)),
  );
  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter(app.get(CoreI18nService)));

  // 全局守卫
  app.useGlobalGuards(new AuthGuard(app.get(Reflector)));
  await app.listen(process.env.PORT ?? 18000, '0.0.0.0');
}
bootstrap();
