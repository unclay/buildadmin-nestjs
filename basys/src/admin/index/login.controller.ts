import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
// core
import { RouteTitle, I18nLang, I18nTranslate, CoreI18nService } from '../../core';
// modules
import { Public } from '../../modules';
import { ApiResponse } from '../../shared';

@Controller('admin/index')
export class LoginController {
  constructor(
    private readonly configService: ConfigService,
    private readonly i18nService: CoreI18nService,
  ) { }
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
  async postLogin(
    @Request() req,
    @I18nLang() lang: string,
    @I18nTranslate() t: Function,
  ) {
    // 使用装饰器方式获取翻译
    const message = t('auth.login.success');
    
    return {
      msg: message,
      data: {
        userInfo: req.user,
        language: lang,
      },
    };
  }

  @Public()
  @Get('test')
  getTest(@I18nLang() lang: string) {
    // 使用服务方式获取翻译
    const errorMessage = this.i18nService.translate('system.error', {}, lang);
    throw ApiResponse.error(errorMessage);
  }

  /**
   * [GET] /admin/index/i18n-demo
   * 国际化功能演示接口
   */
  @Public()
  @Get('i18n-demo')
  getI18nDemo(
    @I18nLang() lang: string,
    @I18nTranslate('common') t: Function,
  ) {
    const tCommon = this.i18nService.namespace('common');
    return {
      currentLanguage: lang,
      supportedLanguages: this.i18nService.getSupportedLanguages(),
      translations2: {
        success: tCommon('success'),
        error: tCommon('error'),
        loginSuccess: tCommon('auth.login.success'),
        userNotFound: this.i18nService.t('common.user.notFound'),
        validation: {
          requiredArgs: tCommon('required', { name: '用户名' }),
          email: tCommon('email'),
        },
      },
      translations: {
        success: t('success'),
        error: t('error'),
        loginSuccess: t('auth.login.success'),
        userNotFound: t('user.notFound'),
        validation: {
          requiredArgs: t('required', { name: '用户名' }),
          email: t('email'),
        },
      },
    };
  }
}
