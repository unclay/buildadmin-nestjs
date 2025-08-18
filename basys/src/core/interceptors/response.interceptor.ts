import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    // buildadmin headers
    response.setHeader('access-control-allow-headers', 'think-lang, server, ba_user_token, ba-user-token, ba_token, ba-token, batoken, Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since, X-CSRF-TOKEN, X-Requested-With');
    response.setHeader('access-control-allow-methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // return next.handle();
    return next.handle().pipe(
      map(data => {
        const xdata = (data?.code || data?.msg) ? data?.data : data;
        return {
          code: data?.code ?? 1,
          msg: data?.msg ?? '',
          time: Math.floor(Date.now() / 1000),
          data: data?.data ?? xdata ?? null
        };
      })
    );
  }
}