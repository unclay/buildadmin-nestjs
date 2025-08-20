import { HttpStatus } from "@nestjs/common";

export class ApiResponse {
    // response data
    code: number;
    msg: string;
    data: any;
    time: number;
    // response type
    type = 'json';
    // header
    header: Record<string, any> = {};
    // status
    statusCode: HttpStatus;
    constructor(msg: string, data = null, code = 0, type?: string, header: Record<string, any> = {}) {
        this.code = code;
        this.msg = msg;
        this.data = data;
        this.time = Math.floor(Date.now() / 1000);
        // other
        // header
        this.statusCode = header.statusCode ?? HttpStatus.BAD_REQUEST;
        delete header.statusCode;
        this.type = type;
        this.header = header;
    }
    static success(msg = '', data = null, code = 1, type: string = null, header: Record<string, any> = {}) {
        return new ApiResponse(msg, data, code, type, {
            ...header,
            statusCode: header.statusCode ?? HttpStatus.OK
        });
    }
    static error(msg = '', data = null, code = 0, type: string = null, header: Record<string, any> = {}) {
        throw new ApiResponse(msg, data, code, type, {
            ...header,
            statusCode: header.statusCode ?? HttpStatus.BAD_REQUEST
        });
    }
}