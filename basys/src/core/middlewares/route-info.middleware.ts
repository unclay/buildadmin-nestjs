import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestDto } from '../dtos/request.dto';

@Injectable()
export class RouteInfoMiddleware implements NestMiddleware {
  use(req: RequestDto, res: Response, next: NextFunction) {
    // 解析路由信息
    const pathStr = req.baseUrl;
    const pathParts = pathStr.split('/').filter(Boolean);
    const [module = '', controllerRaw = '', action = ''] = pathParts;
    const controller = controllerRaw.replace(/\.[A-Z]/, (match) => match.toLowerCase());

    // 挂载到req对象
    req.routeInfo = {
      module,
      controller,
      action,
      controller_name: [controller].join('/').replace('.', '/'),
      action_name: [controller, action].join('/').replace('.', '/'),
    };

    next();
  }
}
