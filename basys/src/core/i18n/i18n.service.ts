import { Injectable, Scope } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable({ scope: Scope.REQUEST })
export class CoreI18nService {
  constructor(
    private readonly i18n: I18nService
  ) {}

  // t(key: string, options?: Record<string, any>): string {
  //   console.log(I18nContext.current(), 9908);
  //   return this.i18n.t(key, {
  //     ...options,
  //     // 读取语言信息
  //     lang: I18nContext.current().lang,
  //   })
  // }



  /**
   * 翻译文本
   * @param key 翻译键
   * @param options 翻译选项
   * @param lang 语言代码，可选。如果不提供，将自动从请求中获取
   * @returns 翻译后的文本
   */
  t(key: string, args?: Record<string, any>, lang?: string) {
    return this.translate(key, args, lang);
  }
  translate(key: string, args?: Record<string, any>, lang?: string): string {
    const targetLang = lang || this.getCurrentLanguage();
    // 如果key不包含点号，自动添加'common.'前缀
    return this.i18n.t(key, {
      args,
      lang: targetLang,
    });
  }

  namespace(namespace: string) {
    return (key: string, args?: Record<string, any>, lang?: string) => {
      return this.translate(`${namespace}.${key}`, args, lang);
    }
  }

  /**
   * 获取支持的语言列表
   * @returns 支持的语言数组
   */
  getSupportedLanguages(): string[] {
    return ['zh-cn', 'en-us'];
  }

  /**
   * 检查是否支持指定语言
   * @param lang 语言代码
   * @returns 是否支持
   */
  isLanguageSupported(lang: string): boolean {
    return this.getSupportedLanguages().includes(lang);
  }

  /**
   * 获取当前请求的语言代码
   * @returns 当前语言代码
   */
  getCurrentLanguage(): string {
    const i18nContext = I18nContext.current();
    return i18nContext?.lang;
  }

  /**
   * 从指定文件命名空间翻译文本
   * @param namespace 文件命名空间 (如: 'common', 'admin', 'api')
   * @param key 翻译键
   * @param options 翻译选项
   * @param lang 语言代码，可选
   * @returns 翻译后的文本
   */
  translateFromNamespace(namespace: string, key: string, options?: any, lang?: string): string {
    const fullKey = `${namespace}.${key}`;
    return this.translate(fullKey, options, lang);
  }

  /**
   * 批量翻译多个键值
   * @param keys 翻译键数组或键值对象
   * @param options 翻译选项
   * @param lang 语言代码，可选
   * @returns 翻译结果对象
   */
  translateBatch(keys: string[] | Record<string, string>, options?: any, lang?: string): Record<string, string> {
    const result: Record<string, string> = {};
    
    if (Array.isArray(keys)) {
      keys.forEach(key => {
        result[key] = this.translate(key, options, lang);
      });
    } else {
      Object.entries(keys).forEach(([alias, key]) => {
        result[alias] = this.translate(key, options, lang);
      });
    }
    
    return result;
  }

  /**
   * 从多个命名空间获取翻译
   * @param namespaces 命名空间配置对象
   * @param lang 语言代码，可选
   * @returns 按命名空间分组的翻译结果
   */
  translateFromNamespaces(namespaces: Record<string, string[]>, lang?: string): Record<string, Record<string, string>> {
    const result: Record<string, Record<string, string>> = {};
    
    Object.entries(namespaces).forEach(([namespace, keys]) => {
      result[namespace] = {};
      keys.forEach(key => {
        const fullKey = `${namespace}.${key}`;
        result[namespace][key] = this.translate(fullKey, {}, lang);
      });
    });
    
    return result;
  }
}