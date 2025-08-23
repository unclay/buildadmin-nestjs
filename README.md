# buildadmin-nestjs

项目灵感于nestjs实战

基于 [buildadmin/web](https://github.com/build-admin/buildadmin) 与 [nestjs](https://github.com/nestjs/nest) 结合

前端采用buildadmin，后端采用nestjs自写

## 开发引导

### 目录说明

- core
    - 被继承的类，显式访问修饰符：public protected private
    - 依赖 nestjs 模块，如 controller service
    - 数据库操作
- common
    - 不依赖 nestjs 模块
    - 非业务逻辑处理
    - 纯数据逻辑处理
    - 接口返回值格式化

### 模块说明

#### CoreApiService 与 BaApi

- CoreApiService
    - 依赖 nestjs 模块
    - 依赖 prisma 模块，数据库操作
    - 依赖 request 对象，网络请求
    - 例如：获取登录用户信息、操作权限判断
- BaApi
    - 可依赖 lodash、dayjs 等非业务模块
    - 不依赖任何业务模块（如 request 对象、数据库操作等）
    - 纯逻辑处理

### 接口规范

#### `controller` 和 `service` 尽量保持 `增删改查` 顺序

+ `controller` 接口函数跟随buildadmin，采用 `add` `del` `edit` `index` 的增删改查函数字面量
+ 一般 edit 包含 GET/POST，所以格式需要增量变化，改为 `getEdit` `postEdit`

```ts
// service 同 controller 增删改查顺序
@Controller('admin/auth.admin')
export class AuthAdminController {
    constructor() {}
    // 增删改查
    @Post('add')
    async add() {}

    @Delete('del')
    async del() {}

    @Get('edit')
    async getEdit() {}
    @Post('edit')
    async postEdit() {}

    @Get('index')
    async index() {}
}
```

### nestjs 学习


```graph
graph LR
    Request --> Controller
    Controller -->|return| Interceptor
    Controller -->|throw| ExceptionFilter
```

## 目录结构划分计划

```
src/
├── app.module.ts              # 根模块，导入CoreModule和特性模块
├── main.ts                    # 入口文件
│
├── core/                      # 【核心】应用基础设施，全局单例
│   ├── core.module.ts         # 注册所有全局核心提供者，并被AppModule导入
│   ├── filters/               # 全局异常过滤器
│   ├── interceptors/          # 全局拦截器（如日志、超时、响应转换）
│   ├── guards/                # 全局守卫（如RBAC权限守卫）
│   ├── decorators/            # 全局通用的装饰器（如@CurrentUser）
│   ├── middleware/            # 全局中间件
│   ├── services/              # 全局单例服务（如ConfigService, AppLogger）
│   └── database/              # 数据库连接（TypeORM/Prisma连接池）
│
├── shared/                    # 【共享】可重用的功能模块库（按需导入）
│   ├── database/              # 数据库抽象模块（提供Repository等）
│   │   ├── database.module.ts
│   │   └── ...
│   ├── cache/                 # 缓存模块
│   ├── mail/                  # 邮件发送模块
│   ├── upload/                # 文件上传模块
│   └── utils/                 # 纯工具函数
│
├── modules/                   # 业务特性模块
│   ├── auth/
│   ├── user/
│   ├── order/
│   └── product/
│
└── common/                    # （可选）真正的通用类型、常量、DTO基类
    ├── dtos/
    ├── constants/
    └── types/
```