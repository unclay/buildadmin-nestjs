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