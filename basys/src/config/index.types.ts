/* eslint-disable @typescript-eslint/no-explicit-any */
// App 配置类型
export interface AppConfig {
  app_host: string;
  app_namespace: string;
  with_route: boolean;
  default_app: string;
  default_timezone: string;
  app_map: Record<string, any>;
  domain_bind: Record<string, any>;
  deny_app_list: string[];
  error_message: string;
  show_error_msg: boolean;
  jwt_secret: string;
  jwt_expires_in: number;
}

export interface ClickCaptchaConfig {
  // 验证码透明度
  alpha?: number;
  // 中文字符集
  zhSet?: string;
  // 验证码模式: ['icon', 'text']
  mode?: string[];
  // 验证码长度
  length?: number;
  // 混淆长度
  confuse_length?: number;
  // 点击位置容差范围(像素)
  tolerance?: number;
  // 验证码过期时间(秒)
  expire?: number;
}

// BuildAdmin 配置类型
export interface BuildAdminConfig {
  cors_request_domain: string;
  user_login_captcha: boolean;
  admin_login_captcha: boolean;
  user_login_retry: number | false;
  admin_login_retry: number | false;
  admin_sso: boolean;
  user_sso: boolean;
  user_token_keep_time: number;
  admin_token_keep_time: number;
  open_member_center: boolean;
  module_pure_install: boolean;
  click_captcha: ClickCaptchaConfig;
  proxy_server_ip: string[];
  token: {
    default: string;
    key: string;
    algo: string;
    stores: {
      mysql: {
        type: string;
        name: string;
        table: string;
        expire: number;
      };
      redis: {
        type: string;
        host: string;
        port: number;
        password: string;
        select: number;
        timeout: number;
        expire: number;
        persistent: boolean;
        prefix: string;
      };
    };
  };
  auto_write_admin_log: boolean;
  default_avatar: string;
  cdn_url: string;
  cdn_url_params: string;
  version: string;
  api_url: string;
}

// Site 配置类型（如果存在）
export interface SiteConfig {
  [key: string]: any;
}

// 配置映射类型
export interface ConfigMap {
  app: AppConfig;
  buildadmin: BuildAdminConfig;
  site?: SiteConfig;
}

// 配置键类型
export type ConfigKey = keyof ConfigMap | `${keyof ConfigMap}.${string}`;

// 配置值类型
export type ConfigValue<T extends ConfigKey> = T extends keyof ConfigMap
  ? ConfigMap[T]
  : T extends `${infer K}.${infer Rest}`
    ? K extends keyof ConfigMap
      ? Rest extends keyof ConfigMap[K]
        ? ConfigMap[K][Rest]
        : any
      : any
    : any;
