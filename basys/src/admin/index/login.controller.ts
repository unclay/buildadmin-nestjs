import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../../modules/auth/auth.decorator';
import { RouteTitle } from '../../core';

@Controller('admin/index')
export class LoginController {
    constructor(private readonly configService: ConfigService) {}
    /**
     * [GET] /admin/index/login
     */
    @Public()
    @Get('login')
    getLogin() {
        return {
            captcha: this.configService.get('buildadmin.admin_login_captcha'),
        }
    }

    /**
     * [POST] /admin/index/login
     */
    @Public()
    @RouteTitle('登录')
    @UseGuards(AuthGuard('auth-local'))
    @Post('login')
    async postLogin(@Request() req) {
        return {
            msg: '登录成功',
            data: {
                userInfo: req.user
            },
        };
    }
}
