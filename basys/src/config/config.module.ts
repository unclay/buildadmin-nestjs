import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configs from './index';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      // 启用配置缓存提升性能
      cache: true,
    }),
  ],
  exports: [ConfigModule],
})
export class NestConfigModule {}
