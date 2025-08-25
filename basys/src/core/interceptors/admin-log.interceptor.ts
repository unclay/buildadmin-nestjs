// src/core/interceptors/operation-log.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';
import { PrismaService } from '../database/prisma.service'; // 假设你用 Prisma
import { RequestHelper } from '../../shared';
import { RequestDto } from '../dtos';

@Injectable()
export class AdminLogInterceptor implements NestInterceptor {
  constructor() { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<RequestDto>();
    const response = httpContext.getResponse<Response>();

    // 只记录 POST, DELETE, PUT, PATCH 等变更操作
    const isLog = request.method === 'POST' || request.method === 'DELETE' || request.method === 'GET';
    if (!isLog) {
      return next.handle(); // 跳过 GET 等请求
    }

    const auth = new RequestHelper(request);
    const adminId = auth.isLogin() ? auth.id : 0;
    const username = auth.isLogin() ? auth.username : 'Unknown';
    const routeInfo = auth.routeInfo;
    console.log(adminId, username, routeInfo);
    const startTime = Date.now();
    console.log(3333);
    return next.handle().pipe(
      tap(async (data) => {
        console.log(3322);
      }),
    );
  }
}