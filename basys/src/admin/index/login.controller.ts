import { Controller, Get, Post } from '@nestjs/common';

@Controller('admin/index')
export class LoginController {
    /**
     * [GET] /admin/index/login
     */
    @Get('login')
    getLogin() {
        return {
            captcha: true
        }
    }

    /**
     * [POST] /admin/index/login
     */
    @Post('login')
    postLogin() {
        return {
            "userInfo": {
                "id": 1,
                "username": "admin",
                "nickname": "Admin",
                "avatar": "\/static\/images\/avatar.png",
                "last_login_time": "2025-07-31 16:50:23",
                "token": "128adae3-665e-4424-94d8-124089ddd460",
                "refresh_token": ""
            }
        };
    }
}
