// src/core/interceptors/operation-log.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';
import { PrismaService } from '../database/prisma.service'; // 假设你用 Prisma
import { RequestDto } from '../dtos';
import { CoreAdminLogService } from '../services';

@Injectable()
export class AdminLogInterceptor implements NestInterceptor {
  constructor(
    private readonly adminLogService: CoreAdminLogService) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<RequestDto>();
    // const response = httpContext.getResponse<Response>();
    let title = Reflect.getMetadata('routeTitle', context.getHandler());

    // 只记录 POST, DELETE, PUT, PATCH 等变更操作
    const isLog = request.method === 'POST' || request.method === 'DELETE';
    if (!isLog) {
      return next.handle(); // 跳过 GET 等请求
    }
    // const startTime = Date.now();
    // console.log('request log', this.adminLogService);
    return next.handle().pipe(
      tap(async (data) => {
        this.adminLogService.record(request, title);
      }),
    );
  }
}