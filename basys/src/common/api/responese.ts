import { HttpException, HttpStatus } from "@nestjs/common";

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
    static error(msg = '', data = null, code = 0, type: ApiResponseType = null, header: Record<string, any> = {}) {
        const responseType = type ?? ApiResponse.defaultType;
        const statusCode = header.statusCode ?? ApiResponse.defaultStatusCode;
        delete header.statusCode;
        return new HttpException({
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
}
