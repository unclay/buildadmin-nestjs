import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('admin/index')
export class LoginController {
    constructor(private readonly configService: ConfigService) {}
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
    postLogin(@Body() body: any) {
        const { username, password, keep } = body;

        // 定义验证规则
        // const rules = {
        //     username: {
        //         required: true,
        //         length: { min: 3, max: 30 }
        //     },
        //     password: {
        //         required: true,
        //         pattern: /^(?!.*[&<>"\'\n\r]).{6,32}$/
        //     }
        // };

        // // 构建验证数据
        // const validationData = {
        //     username,
        //     password
        // };

        // // 如果开启验证码
        // if (this.configService.get('buildadmin.admin_login_captcha')) {
        //     rules['captchaId'] = { required: true };
        //     rules['captchaInfo'] = { required: true };

        //     validationData['captchaId'] = body.captchaId;
        //     validationData['captchaInfo'] = body.captchaInfo;
        // }

        // // 验证数据
        // await this.validateData(validationData, rules);

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

        // // 执行登录
        // try {
        //     const loginResult = await this.authService.login(username, password, keep);
        //     if (loginResult) {
        //         const userInfo = await this.authService.getUserInfo();
        //         return {
        //             message: '登录成功',
        //             data: { userInfo }
        //         };
        //     }
        // } catch (error) {
        //     throw new UnauthorizedException(error.message || '用户名或密码错误');
        // }
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
