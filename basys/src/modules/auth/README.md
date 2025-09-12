# 认证授权模块 (Auth Module)

本模块负责系统的认证（Login）和授权（Auth）功能，采用基于 JWT 的认证机制和基于角色的权限控制系统。

## 📁 文件结构与分类

### 🛡️ 认证策略 (Authentication Strategies) 即登录功能

#### `login-local.strategy.ts` - 本地登录策略，即账号密码登录，生成 token
- **功能**: 实现基于用户名密码的本地认证策略
- **认证流程**:
  1. 从请求体提取 username/password
  2. 校验用户名密码正确性
  3. 验证通过后将用户信息挂载到请求对象
- **策略名称**: `auth-local`
- **继承**: PassportStrategy(Strategy, 'auth-local')

#### `login-jwt.strategy.ts` - JWT 认证策略，即 token 提取登录信息
- **功能**: 实现基于 JWT Token 的认证策略
- **认证流程**:
  1. 从请求头提取 JWT Token
  2. 验证 Token 有效性和过期时间
  3. 从数据库获取用户信息并挂载到请求对象
- **策略名称**: `auth-jwt`
- **继承**: PassportStrategy(Strategy, 'auth-jwt')

#### `login.service.ts` - 登录认证服务
- **功能**: 处理用户登录、密码验证、Token 生成等认证相关业务
- **依赖**: JwtService, PrismaService, TokenService


### 🔧 核心服务 (Core Services)，用于业务权限判断

#### `auth.service.ts` - 权限授权服务
- **功能**: 处理用户权限验证、角色管理、数据权限控制
- **继承**: 继承自 `BaAuth` 基类
- **特性**: 支持数据权限限制、请求级别的用户信息缓存

#### `token.service.ts` - Token 管理服务
- **功能**: Token 的创建、验证、数据库存储管理
- **依赖**: PrismaService, JwtService


### 🔒 守卫与装饰器 (Guards & Decorators)

#### `auth.guard.ts` - 认证守卫
- **功能**: 全局认证守卫，控制路由访问权限
- **特性**:
  - 支持公共路由跳过认证（通过 `@Public()` 装饰器）
  - 使用反射机制检查路由是否需要认证
  - 集成 JWT 认证策略
- **继承**: PassportAuthGuard('auth-jwt')

#### `public.decorator.ts` - 公共路由装饰器
- **功能**: 标记无需认证的公共路由
- **导出**:
  - `IS_PUBLIC_KEY` - 元数据键名常量
  - `Public()` - 装饰器函数，用于标记公共路由
- **使用示例**: `@Public()` 或 `@Public(true)`

### 📦 模块配置 (Module Configuration)

#### `auth.module.ts` - 认证模块配置
- **功能**: 模块依赖注入配置和服务注册
- **导入模块**:
  - `DatabaseModule` - 数据库访问
  - `JwtModule` - JWT 功能支持
- **提供服务**: LoginJwtStrategy, LoginLocalStrategy, AuthGuard, LoginService, TokenService, AuthService
- **导出服务**: AuthGuard, LoginLocalStrategy, LoginService, AuthService

#### `index.ts` - 统一导出文件
- **功能**: 提供模块的统一导出接口
- **导出内容**: 所有核心服务、策略、守卫和装饰器
- **用途**: 简化其他模块的导入语句

## 🔄 认证流程

### 登录认证流程
1. 用户提交用户名密码 → `LoginLocalStrategy`
2. 策略验证成功 → `LoginService.login()`
3. 生成 JWT Token → `TokenService.createToken()`
4. 返回 Token 给客户端

### 请求认证流程
1. 客户端携带 Token 发起请求
2. `AuthGuard` 检查是否为公共路由
3. 非公共路由 → `LoginJwtStrategy` 验证 Token
4. Token 有效 → 获取用户信息并注入请求对象
5. 继续执行业务逻辑

## 🎯 设计特点

- **职责分离**: 登录认证与权限授权分离，代码结构清晰
- **策略模式**: 使用 Passport 策略模式，支持多种认证方式
- **装饰器支持**: 提供 `@Public()` 装饰器灵活控制路由访问
- **数据权限**: 支持基于用户角色的数据访问控制
- **缓存优化**: 请求级别的用户信息缓存，提升性能
- **统一导出**: 通过 index.ts 提供清晰的模块接口

## 📋 使用说明

### 在控制器中使用认证
```typescript
// 需要认证的路由（默认）
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}

// 公共路由（无需认证）
@Public()
@Post('login')
login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

### 在服务中注入认证服务
```typescript
constructor(
  private readonly authService: AuthService,
  private readonly loginService: LoginService,
) {}
```