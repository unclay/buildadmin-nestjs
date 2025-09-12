/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { RequestDto } from 'src/core';
import { ParamFilter } from '../../shared';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class AdminLogService {
  constructor(private readonly prisma: PrismaService) {}

  protected $autoWriteTimestamp = true;
  protected $updateTime = false;

  /**
   * 自定义日志标题
   * @var string
   */
  protected title: string = '';

  /**
   * 忽略的链接正则列表
   * @var array
   */
  protected urlIgnoreRegex: RegExp[] = [
    /^(.*)\/(select|index|logout|login|checkClickCaptcha)$/i,
  ];
  protected desensitizationRegex: RegExp[] = [/(password|salt|token)/i];

  public test() {
    console.log(123);
  }

  /**
   * 写入日志
   * @param string            $title
   * @param string|array|null $data
   * @throws Throwable
   */
  public async record(req: RequestDto, routeTitle: string) {
    const routeInfo = req.routeInfo;
    let title = routeTitle ?? this.title;
    if (!title) {
      const controllerObj = await this.prisma.baAdminRule.findFirst({
        where: { name: routeInfo.controller_name },
        select: { title: true },
      });
      const actionObj = await this.prisma.baAdminRule.findFirst({
        where: { name: routeInfo.action_name },
        select: { title: true },
      });
      const actionName = actionObj?.title ?? `Unknown(${routeInfo?.action})`;
      title = controllerObj?.title
        ? `${controllerObj.title}-${actionName}`
        : actionName;
    }
    // 忽略的链接正则列表
    if (this.urlIgnoreRegex) {
      for (const regex of this.urlIgnoreRegex) {
        if (regex.test(routeInfo.action_name)) {
          return;
        }
      }
    }
    // 初始化 data
    let data =
      req.body && Object.keys(req.body).length > 0 ? req.body : req.query;
    data = ParamFilter.applyJson(
      data,
      'trim,strip_tags,htmlspecialchars'.split(','),
    );
    data = this.desensitization(data);

    // 检查用户是否存在且有效
    if (!req.user?.id) {
      console.warn('AdminLogService: 无法记录日志，用户信息不存在');
      return;
    }

    // 验证管理员是否存在
    const adminExists = await this.prisma.baAdmin.findUnique({
      where: { id: req.user.id },
      select: { id: true },
    });

    if (!adminExists) {
      console.warn(
        `AdminLogService: 管理员 ID ${req.user.id} 不存在，无法记录日志`,
      );
      return;
    }

    await this.prisma.baAdminLog.create({
      data: {
        admin_id: req.user.id,
        username: req.user.username || '',
        url: req.route.path.slice(0, 1500),
        title,
        data: typeof data !== 'string' ? JSON.stringify(data) : data,
        ip: req.ip,
        useragent: req.headers['user-agent']?.slice(0, 255) || '',
      },
    });
  }

  /**
   * 数据脱敏（只数组，根据数组 key 脱敏）
   * @param array|string $data
   * @return array|string
   */
  protected desensitization(
    data: string | Record<string, any>,
  ): string | Record<string, any> {
    if (typeof data !== 'object' || !this.desensitizationRegex) {
      return data;
    }

    const result = { ...data };
    for (const [key, value] of Object.entries(result)) {
      for (const regex of this.desensitizationRegex) {
        if (regex.test(key)) {
          result[key] = '***';
        } else if (typeof value === 'object') {
          result[key] = this.desensitization(value);
        }
      }
    }
    return result;
  }
}
