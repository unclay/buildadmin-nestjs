import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestDto } from '../dto/request.dto';

@Injectable()
export class RequestTimeMiddleware implements NestMiddleware {
  use(req: RequestDto, res: Response, next: NextFunction) {
    // 记录请求到达时间（秒级时间戳，与PHP一致）
    req._requestTime = Math.floor(Date.now() / 1000);
    next();
  }
}