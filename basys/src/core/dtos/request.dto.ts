import { Request } from 'express';
// import '../middlewares/request-time.middleware';
// import '../middlewares/route-info.middleware';
// import '../middlewares/assemble-tree.middleware';
// import '../../modules/auth/local.strategy';

export interface RequestDto extends Request {
  // '../middlewares/request-time.middleware'
  _requestTime: number
  // '../middlewares/route-info.middleware'
  routeInfo?: {
    module: string
    controller: string
    action: string
    controller_name: string
    action_name: string
  }
  // '../middlewares/assemble-tree.middleware'
  assembleTree: boolean
  // '../../modules/auth/local.strategy';
  user?: {
    id: number,
    username: string
  }
  query: Record<string, any>
}