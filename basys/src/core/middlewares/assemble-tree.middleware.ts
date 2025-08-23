import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestDto } from '../dtos/request.dto';

@Injectable()
export class AssembleTreeMiddleware implements NestMiddleware {
  use(req: RequestDto, res: Response, next: NextFunction) {
    const isTree = typeof req.query.isTree === 'string' ? req.query.isTree === 'true' : true;
    let initValue = [];
    if (req.query.initValue) {
        if (Array.isArray(req.query.initValue)) {
            initValue = req.query.initValue.filter(Boolean).map(Number);
        } else {
            initValue = [Number(req.query.initValue)]
        }
    }

    // 有初始化值时不组装树状（初始化出来的值更好看）
    req.assembleTree = isTree && initValue.length === 0;
    next();
  }
}