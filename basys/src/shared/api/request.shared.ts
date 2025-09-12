import { RequestDto } from '../../core';

export class RequestContext {
  constructor(private readonly req: RequestDto) {}

  public isLogin() {
    return Boolean(this.id);
  }
  public get id() {
    return this.req.user?.id;
  }
  public get username() {
    return this.req.user?.username;
  }
  public get routeInfo() {
    return this.req.routeInfo;
  }
}
