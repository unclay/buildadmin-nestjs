import { Request } from 'express';

export function extractTokenFromRequest(req: Request): string | null {
  // 从 Header 提取（Bearer Token）
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }

  // 从 Cookie 提取
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }

  // 从 Query 参数提取
  if (req.query?.token && typeof req.query.token === 'string') {
    return req.query.token;
  }

  return null;
}
