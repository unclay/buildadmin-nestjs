import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../shared/api';

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // 定义一个递归函数来处理对象中的BigInt
        const serializeBigInt = (obj: any): any => {
          if (obj === null || obj === undefined) {
            return obj;
          }

          if (typeof obj === 'bigint') {
            return Number(obj);
          }

          if (Array.isArray(obj)) {
            return obj.map(item => serializeBigInt(item));
          }

          if (typeof obj === 'object') {
            const result: any = {};
            for (const key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result[key] = serializeBigInt(obj[key]);
              }
            }
            return result;
          }

          return obj;
        };
        if (data instanceof ApiResponse) {
          data.responseData = serializeBigInt(data.responseData);
          return data;
        }
        return serializeBigInt(data);
      })
    );
  }
}