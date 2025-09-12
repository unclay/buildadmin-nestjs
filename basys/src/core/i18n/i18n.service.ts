/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '../../i18n/i18n.generated';
import { I18nKeys, I18nNamespaces } from '../../i18n';

@Injectable()
export class CoreI18nService {
  constructor(public readonly i18n: I18nService<I18nTranslations>) {}

  /**
   * 翻译文本
   * @param key 翻译键
   * @param options 翻译选项
   * @param lang 语言代码，可选。如果不提供，将自动从请求中获取
   * @returns 翻译后的文本
   */
  t(
    namespace: I18nNamespaces,
    key: I18nKeys,
    args?: Record<string, any>,
    lang?: string,
  ) {
    return this.translate(namespace, key, args, lang);
  }
  translate(
    namespace: I18nNamespaces,
    key: I18nKeys,
    args?: Record<string, any>,
    lang?: string,
  ): string {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const targetLang = lang || this.getCurrentLanguage();
    const result = this.i18n.t(fullKey as any, {
      args,
      lang: targetLang,
    }) as string;
    // 如果翻译失败（返回原始key），则只显示key的最后一部分
    if (result === fullKey) {
      return result.replace(namespace + '.', '');
    }

    return result;
  }

  namespace(namespace: I18nNamespaces) {
    return (key: I18nKeys, args?: Record<string, any>, lang?: string) => {
      return this.translate(namespace, key, args, lang);
    };
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
   * 批量翻译多个键值
   * @param keys 翻译键数组或键值对象
   * @param options 翻译选项
   * @param lang 语言代码，可选
   * @returns 翻译结果对象
   */
  translateBatch(
    namespace: I18nNamespaces,
    keys: I18nKeys[] | Record<string, string>,
    options?: any,
    lang?: string,
  ): Record<string, string> {
    const result: Record<string, string> = {};

    if (Array.isArray(keys)) {
      keys.forEach((key) => {
        result[key] = this.translate(namespace, key, options, lang);
      });
    } else {
      Object.entries(keys).forEach(([alias, key]) => {
        result[alias] = this.translate(
          namespace,
          key as I18nKeys,
          options,
          lang,
        );
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
  translateFromNamespaces(
    namespaces: Record<I18nNamespaces, I18nKeys[]>,
    lang?: string,
  ): Record<string, Record<string, string>> {
    const result: Record<string, Record<string, string>> = {};

    Object.entries(namespaces).forEach(([namespace, keys]) => {
      result[namespace] = {};
      keys.forEach((key) => {
        result[namespace][key] = this.translate(
          namespace as I18nNamespaces,
          key as I18nKeys,
          {},
          lang,
        );
      });
    });

    return result;
  }
}
