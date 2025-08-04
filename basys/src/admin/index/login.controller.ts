import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './login.dto';
import { AuthService } from 'src/core/services/auth.service';

@Controller('admin/index')
export class LoginController {
    constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {}
    /**
     * [GET] /admin/index/login
     */
    @Get('login')
    getLogin() {
        return {
            captcha: this.configService.get('buildadmin.admin_login_captcha'),
        }
    }

    /**
     * [POST] /admin/index/login
     */
    @Post('login')
    async postLogin(@Body() loginDto: LoginDto) {
        const { username, password, keep } = loginDto;

        // // 验证码校验
        // if (this.configService.get('buildadmin.admin_login_captcha')) {
        //     const captchaValid = await this.captchaService.verify(
        //         validationData.captchaId,
        //         validationData.captchaInfo
        //     );
        //     if (!captchaValid) {
        //         throw new BadRequestException('验证码错误');
        //     }
        // }

        // // 记录登录日志
        // await this.adminLogService.create({
        //     title: '登录'
        // });

        // 执行登录
        try {
            const res = await this.authService.login(username, password, keep);
            if (res === true) {
                const userInfo = await this.authService.getInfo();
                return {
                    msg: '登录成功',
                    data: {
                        userInfo
                    }
                };
            }
        } catch (error) {
            throw new UnauthorizedException(error.message || '用户名或密码错误');
        }
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
