import { HttpException, HttpStatus } from '@nestjs/common';

// 接口异常类
export class ApiException extends HttpException {
  // 参数格式（同buildadmin-php）
  constructor(msg: string, data: any = null, code = 0) {
    super(
      {
        code,
        msg,
        time: Math.floor(Date.now() / 1000),
        data,
      },
      HttpStatus.OK,  // HTTP 200
    );
  }
}

// token 过期异常类
export class TokenExpirationException extends ApiException {
  constructor(msg = 'token expired', data: any = null, code = 409) {
    super(msg, data, code);
  }
}
