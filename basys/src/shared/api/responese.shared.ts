import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { I18nValidationException } from "nestjs-i18n";

type ApiResponseType = 'json' | 'jsonp'
export interface ApiResponseMetadata {
  header: Record<string, any>
  type: ApiResponseType
}
export interface ApiResponseData {
  code: number;
  msg: string;
  data: any;
  time: number;
  metadata: ApiResponseMetadata
}

export class ApiResponse {
  static defaultType: ApiResponseType = 'json';
  static defaultStatusCode = HttpStatus.OK;
  constructor(
    public responseData: ApiResponseData,
    public statusCode: HttpStatus
  ) {
  }
  /**
   * return ApiResponse.success()
   */
  static success(msg = '', data = null, code = 1, type: ApiResponseType = null, header: Record<string, any> = {}) {
    const responseType = type ?? ApiResponse.defaultType;
    const statusCode = header.statusCode ?? ApiResponse.defaultStatusCode;
    delete header.statusCode;
    return new ApiResponse({
      code,
      msg,
      time: Math.floor(Date.now() * 0.001),
      data,
      metadata: {
        type: responseType,
        header,
      }
    }, statusCode);
  }
  /**
   * 用法：throw ApiResponse.error()
   */
  static error(msg = '', data = null, code = 0, type: ApiResponseType = null, header: Record<string, any> = {}, metadata: Record<string, any> = {}) {
    const responseType = type ?? ApiResponse.defaultType;
    const statusCode = header.statusCode ?? ApiResponse.defaultStatusCode;
    delete header.statusCode;
    const json = {
      code,
      msg,
      time: Math.floor(Date.now() * 0.001),
      data,
      metadata: {
        type: responseType,
        header,
        ...metadata,
      }
    };
    const errorApiResponse = new ApiResponse({
      code,
      msg,
      time: Math.floor(Date.now() * 0.001),
      data,
      metadata: {
        type: responseType,
        header,
        ...metadata,
      }
    }, statusCode);
    // nestjs 采用异常过滤器，把自定义的异常对象，转换为 http 异常对象，并挂载到 cause
    return new HttpException(json, statusCode, {
      cause: errorApiResponse,
    });
  }
  static from(data: any) {
    // 已封装的统一数据格式
    if (data instanceof ApiResponse) {
      return data;
    }
    if (data?.cause instanceof ApiResponse) {
      return data.cause;
    }
    if (data instanceof I18nValidationException) {
      const messages = data.errors.reduce((prev, item) => {
        return prev.concat(Object.values(item.constraints));
      }, []).map((constraint) => {
        const params = constraint.split('|');
        let args: any = params.pop();
        try {
          args = JSON.parse(args);
        } catch (err) {
          args = {}
        }
        const key = params.join('|');
        return [key, args];
      });
      return ApiResponse.error(messages.join(', '), data.getResponse(), data.getStatus(), null, undefined, {
        source: data,
        messages,
      }).cause;
    }
    // 主要处理 dto 异常
    if (data instanceof BadRequestException) {
      const res = data.getResponse() as Record<string, any>;
      const message = Array.isArray(res?.message) ? Array.from(new Set(res.message)).join(',') : res?.message;
      return ApiResponse.error(message, res.error, res.statusCode).cause;
    }
    // 未封装的异常数据
    if (data?.error || data?.message) {
      return ApiResponse.error(data?.message, data?.error, data?.statusCode).cause;
    }
    // 未封装的纯数据
    const xdata = (data?.code || data?.msg) ? data?.data : data;
    return ApiResponse.success(data?.msg, data?.data ?? xdata ?? null, data?.code);
  }
}
