import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, ApiResponseData } from '../../shared';

@Injectable()
export class DateTimeInterceptor implements NestInterceptor {
  private readonly dateFields = [
    'create_time',
    'update_time',
    'last_login_time',
    'expire_time',
  ];

  /**
   * 转换日期字段为时间戳
   * @param data
   * @returns
   */
  private transformToTimestamp(data: ApiResponseData) {
    if (data === null || data === undefined) {
      return data;
    }

    if (data instanceof ApiResponse) {
      data.responseData = this.transformToTimestamp(data.responseData);
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.transformToTimestamp(item));
    }

    if (Object.prototype.toString.call(data) === '[object Object]') {
      const transformed = Object.assign({}, data);
      for (const key in transformed) {
        if (this.dateFields.includes(key) && transformed[key] instanceof Date) {
          transformed[key] = Math.floor(transformed[key].getTime() / 1000); // 转换为秒级时间戳
        } else if (Object.prototype.toString.call(data) === '[object Object]') {
          transformed[key] = this.transformToTimestamp(transformed[key]);
        }
      }
      return transformed;
    }

    return data;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Omit<ApiResponseData, 'metadata'> | string> {
    return next.handle().pipe(map((data) => this.transformToTimestamp(data)));
  }
}
