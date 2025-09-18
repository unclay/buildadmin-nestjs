# 第一阶段：构建依赖（打包环境）
FROM node:22-alpine AS builder_dev_deps
WORKDIR /app
RUN corepack enable && \
    pnpm config set store-dir /root/pnpm-store && \
    pnpm config set registry https://registry.npmmirror.com/
COPY package*.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/pnpm-store \
    pnpm install --frozen-lockfile

# 第一阶段：构建依赖（生产环境）
FROM node:22-alpine AS builder_prod_deps
WORKDIR /app
RUN corepack enable && \
    pnpm config set store-dir /root/pnpm-store && \
    pnpm config set registry https://registry.npmmirror.com/
COPY package*.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/pnpm-store \
    pnpm install --frozen-lockfile --prod

# 第二阶段：构建应用
FROM builder_dev_deps AS builder_app
COPY prisma ./prisma
COPY tsconfig*.json nest-cli.json ./
RUN pnpm prisma generate
COPY src ./src
RUN pnpm run build

# 第三阶段：生产环境
FROM node:22-alpine AS app
WORKDIR /app
# RUN corepack enable
COPY --from=builder_prod_deps /app/node_modules ./node_modules
COPY --from=builder_app /app/dist ./dist
COPY --from=builder_app /app/node_modules/.prisma ./node_modules/.prisma
COPY package.json ./
CMD ["npm", "run", "start:prod"]
