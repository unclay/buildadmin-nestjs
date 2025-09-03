import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";
import { ApiResponseData } from "../../shared/api";

// 全局异常过滤器: 获取到异常数据后，格式化成标准接口异常数据输出
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const responseData = exception.getResponse() as ApiResponseData;
    const status = exception.getStatus();
    const metadata = responseData.metadata;
    delete responseData.metadata;
    if (metadata?.type === 'jsonp') {
        response.status(status).jsonp(responseData);
    } else {
        response.status(status).json(responseData);
    }
  }
}