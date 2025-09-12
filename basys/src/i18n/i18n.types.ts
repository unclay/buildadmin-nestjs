/* eslint-disable @typescript-eslint/no-explicit-any */
import { I18nTranslations } from './i18n.generated';

// 生成非叶子节点路径的类型工具
type NonLeafPaths<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? K extends string
      ? `${Prefix}${K}` | NonLeafPaths<T[K], `${Prefix}${K}.`>
      : never
    : never;
}[keyof T];
// 生成叶子节点路径的类型工具
type LeafPaths<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? LeafPaths<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];
// 生成叶子节点键名的类型工具
type LeafKeys<T> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? LeafKeys<T[K]> // 如果是对象，递归处理
    : T[K] extends string
      ? K // 如果是字符串，返回当前键名
      : never;
}[keyof T];

// 获取所有非叶子节点路径
export type I18nNamespaces = NonLeafPaths<I18nTranslations> | string;
export type I18nFullKeys = LeafPaths<I18nTranslations> | string;
export type I18nKeys = LeafKeys<I18nTranslations> | string;

// const i18nKeys: I18nFullKeys[] = [
//   "admin.dashboard.statistics.orders",
// ];

// // 测试用例
// const validPaths: NonLeafKeys[] = [
//   "admin",
//   "admin.dashboard",
//   "admin.dashboard.statistics",
// ];

// // 这些路径应该会导致类型错误
// const invalidPaths: NonLeafKeys[] = [
//   "admin.dashboard.title", // ❌ 类型错误（叶子节点）
//   "admin.dashboard.welcome", // ❌ 类型错误（叶子节点）
//   "admin.dashboard.statistics.users", // ❌ 类型错误（叶子节点）
//   "nonexistent.path" // ❌ 类型错误（不存在）
// ];
