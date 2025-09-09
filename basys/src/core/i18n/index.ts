import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nNamespaces, I18nKeys } from '../../i18n';

export * from './i18n.module';
export * from './i18n.service';
export * from './i18n.decorator';

export function i18nValidationNamespace(namespace: I18nNamespaces, key: I18nKeys, args?: Record<string, any>) {
  return i18nValidationMessage(key, {
    namespace,
    args,
  });
}