import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";
import { ApiResponse, ApiResponseData } from "../../shared";

// 全局异常过滤器: 获取到异常数据后，格式化成标准接口异常数据输出
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // 统一数据格式
    const apiResponse = ApiResponse.from(exception.getResponse());
    const { responseData, statusCode } = apiResponse;
    const { metadata } = responseData;
    delete responseData.metadata;
    if (metadata?.type === 'jsonp') {
      response.status(statusCode).jsonp(responseData);
    } else {
      response.status(statusCode).json(responseData);
    }
  }
}