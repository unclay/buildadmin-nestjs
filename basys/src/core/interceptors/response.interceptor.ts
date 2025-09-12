import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, ApiResponseData } from '../../shared/api';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Omit<ApiResponseData, 'metadata'> | string> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    // buildadmin headers
    response.setHeader(
      'access-control-allow-headers',
      'think-lang, server, ba_user_token, ba-user-token, ba_token, ba-token, batoken, Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since, X-CSRF-TOKEN, X-Requested-With',
    );
    response.setHeader(
      'access-control-allow-methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    // return next.handle();
    return next.handle().pipe(
      map((data) => {
        const apiData = ApiResponse.from(data);
        // 已封装的统一数据格式
        const {
          responseData: { metadata, ...responseData },
          statusCode,
        } = apiData;
        response.status(statusCode);
        if (
          metadata.type === 'jsonp' &&
          request.query?.callback &&
          typeof request.query?.callback === 'string'
        ) {
          response.header('Content-Type', 'application/javascript');
          return `${request.query?.callback}(${JSON.stringify(responseData)})`;
        }
        return responseData;
      }),
    );
  }
}
