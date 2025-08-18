import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestTimeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 记录请求到达时间（秒级时间戳，与PHP一致）
    req['_requestTime'] = Math.floor(Date.now() / 1000);
    next();
  }
}