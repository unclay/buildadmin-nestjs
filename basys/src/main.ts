import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
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

  // 获取配置服务
  const configService = app.get(ConfigService);

  // 从配置中读取CORS域名
  const corsRequestDomain = configService.get<string>(
    'buildadmin.cors_request_domain',
    'localhost,127.0.0.1',
  );
  const allowedOrigins = corsRequestDomain.split(',').map((domain) => {
    // 如果域名不包含协议，则添加http://前缀
    if (!domain.includes('://')) {
      return `http://${domain.trim()}`;
    }
    return domain.trim();
  });

  // 跨域配置
  app.enableCors({
    origin: allowedOrigins,
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
  await app.listen(process.env.PORT ?? 18000, process.env.HOST ?? '0.0.0.0');
}
bootstrap();
