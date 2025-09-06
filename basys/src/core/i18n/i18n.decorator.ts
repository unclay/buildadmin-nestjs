import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { I18nNamespace } from './i18n.types';

/**
 * 获取当前请求的语言
 * 使用方式: @I18nLang() lang: string
 */
export const I18nLang = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const i18n = I18nContext.current(ctx);
    return i18n?.lang || 'zh-cn';
  },
);

/**
 * 获取翻译函数
 * 使用方式: @I18nTranslate() t: I18nTranslator 或 @I18nTranslate('common') t: I18nTranslator
 * 返回的函数会自动使用当前请求的语言
 */
export const I18nTranslate = createParamDecorator(
  (namespace: I18nNamespace, ctx: ExecutionContext) => {
    const i18n = I18nContext.current(ctx);
    const currentLang = i18n?.lang || 'zh-cn';
    
    // 返回一个自动使用当前语言的翻译函数
    return (key: string, args?: Record<string, any>, lang?: string) => {
      if (!i18n?.service?.t || !key) return key;
      // 如果namespace存在，添加命名空间前缀
      const spaceKey = namespace ? `${namespace}.${key}` : key;
      return i18n.service.t(spaceKey, {
        args,
        lang: lang || currentLang,
      });
    };
  },
);

/**
 * 获取完整的I18n上下文
 * 使用方式: @I18nCtx() i18n: I18nContext
 */
export const I18nCtx = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return I18nContext.current(ctx);
  },
);