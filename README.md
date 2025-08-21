# buildadmin-nestjs

项目灵感于nestjs实战

基于 [buildadmin/web](https://github.com/build-admin/buildadmin) 与 [nestjs](https://github.com/nestjs/nest) 结合

前端采用buildadmin，后端采用nestjs自写

## 开发引导

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