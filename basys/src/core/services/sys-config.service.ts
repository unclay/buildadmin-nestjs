// 生成nestjs service
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../database';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CoreSysConfigService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private prisma: PrismaService,
  ) { }
  private async getCache(key, callback) {
    const data = await this.cache.get(key);
    if (data) return data;
    const result = await callback();
    await this.cache.set(key, result);
    return result;
  }
  private toJson(value: string) {
    if (!value) return;
    try {
      return JSON.parse(value);
    } catch(err) {
      return value;
    }
  }
  private toString(json: any) {
    if (!json) return '';
    if (typeof json === 'string') return json;
    return JSON.stringify(json);
  }
  public async getSysConfig(name = '', group = '', concise = true) {
    if (name) {
      // 直接使用->value('value')不能使用到模型的类型格式化
      const config = await this.getCache(name, () => {
        return this.prisma.baConfig.findFirst({
          where: { name },
          select: { value: true },
        });
      });
      return this.toJson(config.value);
    }

    const key = group ? `group:${group}` : 'sys_config_all';
    const findOptions = group ? ({
      where: {
        group,
      },
      select: {
        name: true,
        value: true,
      }
    }) : ({
      orderBy: {
        weigh: 'desc',
      },
    });
    const configs = await this.getCache(key, () => {
      return this.prisma.baConfig.findMany({
        ...findOptions as any,
      });
    });
    if (concise) {
      return configs.reduce((prev, cur) => {
        prev[cur.name] = this.toJson(cur.value);
        return prev;
      }, {});
    }
    return configs;
  }
}