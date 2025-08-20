# buildadmin-nestjs

项目灵感于nestjs实战

基于 [buildadmin/web](https://github.com/build-admin/buildadmin) 与 [nestjs](https://github.com/nestjs/nest) 结合

前端采用buildadmin，后端采用nestjs自写

## 开发规范

## 接口规范

+ `controller` 和 `service` 尽量保持 `增删改查` 顺序
+ `controller` 接口函数跟随buildadmin，采用 `add` `del` `edit` `index` 的增删改查函数字面量
+ 一般 edit 包含 GET/POST，所以格式需要增量变化，改为 `getEdit` `postEdit`，即 `httpMethod + Edit`