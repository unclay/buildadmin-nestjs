import { Request } from 'express';

export interface RequestDto extends Request {
    _requestTime: number
    routeInfo?: {
        module: string
        controller: string
        action: string
        controller_name: string
        action_name: string
    }
}