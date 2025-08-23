import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";
import { ApiResponseData } from "../../shared/api";

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