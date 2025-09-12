# 国际化 (i18n) 多文件配置指南

本项目支持多文件国际化配置，可以将不同模块的翻译内容分别存储在不同的JSON文件中，便于管理和维护。

## 文件结构

```
src/i18n/
├── zh-cn/                 # 中文翻译文件
│   ├── common.json        # 通用翻译（成功、错误、验证等）
│   ├── admin.json         # 管理后台翻译（仪表盘、菜单、操作等）
│   ├── api.json           # API相关翻译（错误码、响应消息等）
│   └── index.json         # 首页相关翻译
├── en-us/                 # 英文翻译文件
│   ├── common.json        # 通用翻译
│   ├── admin.json         # 管理后台翻译
│   ├── api.json           # API相关翻译
│   └── index.json         # 首页相关翻译
└── README.md              # 本文档
```

## 翻译文件内容示例

### common.json - 通用翻译
```json
{
  "success": "成功",
  "error": "错误",
  "validation": {
    "required": "{{field}}是必填项",
    "minLength": "{{field}}最少需要{{min}}个字符"
  },
  "auth": {
    "login": {
      "success": "登录成功",
      "failed": "登录失败"
    }
  }
}
```

### admin.json - 管理后台翻译
```json
{
  "dashboard": {
    "title": "仪表盘",
    "welcome": "欢迎使用管理系统"
  },
  "menu": {
    "home": "首页",
    "users": "用户管理"
  },
  "actions": {
    "create": "新建",
    "edit": "编辑",
    "delete": "删除"
  }
}
```

### api.json - API相关翻译
```json
{
  "errors": {
    "notFound": "资源未找到",
    "unauthorized": "未授权访问",
    "badRequest": "请求参数错误"
  },
  "responses": {
    "created": "创建成功",
    "updated": "更新成功"
  }
}
```

## 在代码中使用翻译

### 1. 自动语言检测（推荐）

服务会自动从HTTP请求中检测语言，按以下优先级：
1. 查询参数 `?lang=en-us`
2. `Accept-Language` 请求头
3. `think-lang` 自定义请求头
4. 默认语言 `zh-cn`

```typescript
import { CoreI18nService } from '@/core/i18n/i18n.service';

@Injectable()
export class ExampleService {
  constructor(private readonly i18n: CoreI18nService) {}

  // 自动检测语言 - 推荐方式
  getCommonMessage() {
    return this.i18n.translate('common.success'); // 自动使用请求中的语言
  }

  // 获取当前请求的语言
  getCurrentLang() {
    return this.i18n.getCurrentLanguage(); // 返回当前请求的语言代码
  }

  // 手动指定语言（覆盖自动检测）
  getEnglishMessage() {
    return this.i18n.translate('common.success', {}, 'en-us'); // 强制使用英文
  }

  // 带参数的翻译
  getValidationMessage() {
    return this.i18n.translate('common.validation.required', { field: '用户名' });
  }
}
```

### 2. 在控制器中使用

```typescript
@Controller('api/example')
export class ExampleController {
  constructor(private readonly i18n: CoreI18nService) {}

  @Get()
  async getMessages() {
    // 自动使用请求中的语言
    return {
      currentLang: this.i18n.getCurrentLanguage(),
      success: this.i18n.translate('common.success'),
      title: this.i18n.translate('admin.dashboard.title'),
    };
  }

  @Post()
  async create(@Body() data: any) {
    try {
      // 业务逻辑...
      return {
        success: true,
        message: this.i18n.translate('api.responses.created') // 自动语言
      };
    } catch (error) {
      return {
        success: false,
        message: this.i18n.translate('api.errors.internalError') // 自动语言
      };
    }
  }
}
```

### 3. 客户端语言传递方式

```bash
# 方式1: 查询参数（优先级最高）
GET /api/example?lang=en-us

# 方式2: Accept-Language 请求头
curl -H "Accept-Language: en-us,en;q=0.9,zh-cn;q=0.8" /api/example

# 方式3: 自定义请求头
curl -H "think-lang: en-us" /api/example

# 方式4: 混合使用（查询参数优先）
curl -H "Accept-Language: zh-cn" "/api/example?lang=en-us"
```

### 2. 使用命名空间方法

```typescript
// 从指定命名空间翻译
const message = this.i18n.translateFromNamespace('admin', 'dashboard.title');
// 等同于: this.i18n.translate('admin.dashboard.title')

// 批量翻译
const messages = this.i18n.translateBatch([
  'common.success',
  'admin.dashboard.title',
  'api.errors.notFound'
]);
// 结果: { 'common.success': '成功', 'admin.dashboard.title': '仪表盘', ... }

// 使用别名批量翻译
const aliasMessages = this.i18n.translateBatch({
  success: 'common.success',
  title: 'admin.dashboard.title',
  error: 'api.errors.notFound'
});
// 结果: { success: '成功', title: '仪表盘', error: '资源未找到' }

// 从多个命名空间获取翻译
const namespaceMessages = this.i18n.translateFromNamespaces({
  common: ['success', 'error'],
  admin: ['dashboard.title', 'menu.home'],
  api: ['errors.notFound', 'responses.created']
});
// 结果按命名空间分组
```

### 3. 在控制器中使用

```typescript
@Controller('api/example')
export class ExampleController {
  constructor(private readonly i18n: CoreI18nService) {}

  @Post()
  async create(@Body() data: any, @Headers('accept-language') lang = 'zh-cn') {
    try {
      // 业务逻辑...
      return {
        success: true,
        message: this.i18n.translate('api.responses.created', {}, lang)
      };
    } catch (error) {
      return {
        success: false,
        message: this.i18n.translate('api.errors.internalError', {}, lang)
      };
    }
  }

  @Get('dashboard')
  async getDashboard(@Headers('accept-language') lang = 'zh-cn') {
    const translations = this.i18n.translateBatch({
      title: 'admin.dashboard.title',
      welcome: 'admin.dashboard.welcome',
      homeMenu: 'admin.menu.home',
      usersMenu: 'admin.menu.users'
    }, {}, lang);

    return {
      ...translations,
      // 其他数据...
    };
  }
}
```

## 翻译键命名规范

1. **文件名作为顶级命名空间**：`文件名.键名`
   - `common.success` → common.json 中的 success
   - `admin.dashboard.title` → admin.json 中的 dashboard.title

2. **使用点号分隔层级**：
   - `admin.menu.home` → admin.json 中 menu 对象的 home 属性
   - `api.errors.notFound` → api.json 中 errors 对象的 notFound 属性

3. **命名建议**：
   - 使用小驼峰命名法：`dashboardTitle`
   - 或使用点号分隔：`dashboard.title`
   - 保持一致性，建议在同一项目中使用统一风格

## 支持的语言

当前支持的语言：
- `zh-cn`: 简体中文
- `en-us`: 美式英语

要添加新语言，只需：
1. 在 `src/i18n/` 下创建对应的语言目录（如 `ja-jp`）
2. 复制现有翻译文件并翻译成目标语言
3. 系统会自动识别新的语言目录

## 最佳实践

1. **按功能模块分文件**：将相关的翻译内容放在同一个文件中
2. **保持文件结构一致**：所有语言的文件结构应该相同
3. **使用有意义的键名**：键名应该能够清楚表达其用途
4. **避免重复**：相同的翻译内容应该复用，不要重复定义
5. **及时更新**：添加新功能时，记得同步更新所有语言的翻译文件
6. **使用参数化翻译**：对于需要动态内容的翻译，使用 `{{参数名}}` 占位符

## 注意事项

1. **文件编码**：所有翻译文件必须使用 UTF-8 编码
2. **JSON格式**：确保所有翻译文件都是有效的 JSON 格式
3. **键名唯一性**：在同一个文件中，键名必须唯一
4. **语言代码**：使用标准的语言代码格式（如 zh-cn, en-us）
5. **热重载**：开发环境下，翻译文件的修改会自动重载，无需重启服务