
## 提交规范

https://www.conventionalcommits.org/zh-hans/v1.0.0/

```
feat: 新功能（feature）
fix: 修补bug

chore: 构建过程或辅助工具的变动
build: 用于修改项目构建系统，例如修改依赖库、外部接口或者升级 Node 版本等；
chore: 用于对非业务性代码进行修改，例如修改构建流程或者工具配置等；
ci: 用于修改持续集成流程，例如修改 Travis、Jenkins 等工作流配置；
docs: 用于修改文档，例如修改 README 文件、API 文档等；
style: 用于修改代码的样式，例如调整缩进、空格、空行等；
refactor: 用于重构代码，例如修改代码结构、变量名、函数名等但不修改功能逻辑；
perf: 用于优化性能，例如提升代码的性能、减少内存占用等；
test: 用于修改测试用例，例如添加、删除、修改代码的测试用例等。
```


## 命令集合

```bash
npx prisma migrate reset
npx prisma migrate dev --name init_admin
npx prisma generate
npm run seed
# 查看数据库
npx prisma studio
# docker
docker-compose down && docker-compose build --no-cache && docker-compose up -d
docker-compose up -d --build
docker-compose ps
docker-compose inspect [id/name]
```