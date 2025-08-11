import { Controller, Get, Request } from '@nestjs/common';
// import { AuthService } from 'src/core/services/auth.service';
import { ConfigService } from '@nestjs/config';
import { Public } from '../../modules/auth/auth.decorator';
import { AuthService } from '../../modules/auth/auth.service';

@Controller('admin/index')
export class IndexController {
    constructor(
        private readonly configService: ConfigService,
        private authService: AuthService,
    ) {}
    /**
     * [GET] /admin/index/index
     */
    @Get('index')
    async index(@Request() req) {
        // const adminInfo = await this.authService.getInfo();
        // const isSuperAdmin = await this.authService.isSuperAdmin();
        // delete adminInfo['token'];
        // delete adminInfo['refresh_token'];

        const menus = await this.authService.getMenus(req.user.id);
        if (!menus) {
            throw new Error('没有后台菜单，请联系超级管理员！');
        }
        return {
            adminInfo: req.user,
            menus,
            siteConfig: {
                siteName: this.configService.get('site.siteName'),
                version: this.configService.get('site.version'),
                apiUrl: this.configService.get('site.apiUrl'),
                upload: {
                    maxSize: this.configService.get('site.upload.maxSize'),
                    saveName: this.configService.get('site.upload.saveName'),
                    allowedSuffixes: this.configService.get('site.upload.allowedSuffixes'),
                    allowedMimeTypes: this.configService.get('site.upload.allowedMimeTypes')
                },
                cdnUrl: this.configService.get('site.cdnUrl'),
                cdnUrlParams: this.configService.get('site.cdnUrlParams')
            },
            terminal: {
                phpDevelopmentServer: false, // Node.js环境下不需要PHP开发服务器标识
                npmPackageManager: process.env.NPM_PACKAGE_MANAGER || 'npm'
            }
        };
    }
}
