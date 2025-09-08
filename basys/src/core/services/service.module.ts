import { Module } from "@nestjs/common";
import { CoreSysConfigService } from "./";
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register({ ttl: 60 * 1000 })],
  providers: [CoreSysConfigService],
  exports: [CoreSysConfigService],
})
export class CoreServiceModule {}
