import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { I18nValidationException } from 'nestjs-i18n';
import { Response } from 'express';
import { ApiResponse } from '../../shared';
import { CoreI18nService } from '../i18n';

// 全局异常过滤器: 获取到异常数据后，格式化成标准接口异常数据输出
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: CoreI18nService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // 统一数据格式
    const apiResponse = ApiResponse.from(exception);
    const { responseData, statusCode } = apiResponse;
    const { metadata } = responseData;
    delete responseData.metadata;
    // 处理i18n异常
    if (
      metadata?.source instanceof I18nValidationException &&
      metadata?.messages
    ) {
      // 翻译异常信息
      responseData.msg = metadata.messages
        .map(([key, { namespace, args }]) => {
          return this.i18n.t(namespace, key, args);
        })
        .join(', ');
    }
    if (metadata?.type === 'jsonp') {
      response.status(statusCode).jsonp(responseData);
    } else {
      response.status(statusCode).json(responseData);
    }
  }
}
