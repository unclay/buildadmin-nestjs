# buildadmin-nestjs

项目灵感于nestjs实战

基于 [buildadmin/web](https://github.com/build-admin/buildadmin) 与 [nestjs](https://github.com/nestjs/nest) 结合

前端采用buildadmin，后端采用nestjs自写

## 功能实现

- 底层功能
    - [x] nestjs
    - [x] prisma + postgresql 数据库
    - [x] config 公共配置模块
    - [x] api 统一返回格式
    - [x] dto 参数校验
    - [x] 授权登录（JWT策略）
    - [x] 国际化
    - [x] dockerfile + docker-compose 部署
    - [ ] redis 缓存
    - [ ] CICD持续集成
- 业务功能
    - [x] 角色组管理
    - [x] 管理员管理
    - [x] 菜单规则管理
    - [x] 管理员日志管理
    - [x] 系统配置
    - [ ] 个人资料
    - [ ] 控制台
    - [ ] 会员管理
    - [ ] 会员分组管理
    - [ ] 会员规则管理
    - [ ] 会员余额管理
    - [ ] 会员积分管理
    - [ ] CRUD模块


## 开发引导

### 授权逻辑

本地登录策略 + JWT认证策略

- LoginLocalStrategy : 处理用户名密码登录
- LoginJwtStrategy : 处理 Token 验证
- AuthGuard : 全局守卫控制路由访问
- @Public() 装饰器标记公共路由

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

### nestjs 模块流向

```graph
graph LR
    Request --> Controller
    Controller -->|return| Interceptor
    Controller -->|throw| ExceptionFilter
```

## 目录结构划分计划

```md
- modules 可以依赖 core，core 不能依赖 modules
- shared 不能依赖任何，只能被 core、modules 依赖
```

```md
src/
├── app.module.ts              # 根模块，导入CoreModule和特性模块
├── main.ts                    # 入口文件
│
├── admin/                     # 接口路由
├── api/                       # 接口路由
│
├── config/                    # 公共配置模块
├── i18n/                      # 国际化
│
├── core/                      # 【核心】应用基础设施，全局单例
│   ├── core.module.ts         # 注册所有全局核心提供者，并被AppModule导入
│   ├── filters/               # 全局异常过滤器（异常api格式化）
│   ├── interceptors/          # 全局拦截器（如操作日志、日期时间转换、正常api格式化）
│   ├── decorators/            # 全局通用的装饰器（如@RouteTitle、@[DTO]装饰器）
│   ├── middleware/            # 全局中间件（如路由信息处理、访问时间）
│   ├── services/              # 全局单例服务（如crud、api、auth、sys-config）
│   └── database/              # 数据库连接（Prisma连接池/redis缓存）
│
├── shared/                    # 【共享】可重用的功能模块库（按需导入）
│   ├── api                    # 接口相关的工具，例如返回值格式
│   └── utils/                 # 纯工具函数，
│
└── modules/                   # 业务特性模块
    ├── auth/                  # 授权登录
    └── log/                   # 管理员操作日志
```