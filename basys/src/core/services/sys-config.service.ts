// 生成nestjs service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database';
import { Cache, createCache } from 'cache-manager';
import { Prisma } from '@prisma/client';

@Injectable()
export class CoreSysConfigService {
  private cache: Cache;

  constructor(private prisma: PrismaService) {
    // 创建独立的系统配置缓存实例
    this.cache = createCache({
      ttl: 60 * 1000, // 60秒过期时间
    });
  }
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
    } catch {
      return value;
    }
  }
  // private toString(json: any) {
  //   if (!json) return "";
  //   if (typeof json === "string") return json;
  //   return JSON.stringify(json);
  // }
  public get(name = '', group = '', concise = true) {
    return this.getSysConfig(name, group, concise);
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
    const findOptions = group
      ? {
          where: {
            group,
          },
          select: {
            name: true,
            value: true,
          },
        }
      : {
          orderBy: {
            weigh: 'desc',
          },
        };
    const configs = await this.getCache(key, async () => {
      const list = await this.prisma.baConfig.findMany({
        ...(findOptions as Prisma.BaConfigFindManyArgs),
      });
      return list.map((item) => {
        return {
          ...item,
          value: this.toJson(item.value),
          content: this.toJson(item.content),
        };
      });
    });
    if (concise) {
      return configs.reduce((prev, cur) => {
        prev[cur.name] = cur.value;
        return prev;
      }, {});
    }
    return configs;
  }

  /**
   * 清除指定配置项的缓存
   * @param name 配置项名称
   */
  public async clearCache(name?: string) {
    if (name) {
      await this.cache.del(name);
    } else {
      // 清除所有缓存
      await this.cache.clear();
    }
  }
}
