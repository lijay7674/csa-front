# -- 构建阶段 --
FROM node:22-alpine AS builder
WORKDIR /app

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 复制 workspace 配置和依赖声明
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/web/package.json ./packages/web/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源码
COPY packages/shared/src ./packages/shared/src
COPY packages/web/src ./packages/web/src
COPY packages/web/index.html ./packages/web/
COPY packages/web/vite.config.ts ./packages/web/
COPY packages/web/tsconfig.json ./packages/web/
COPY packages/web/tailwind.config.js ./packages/web/
COPY packages/web/postcss.config.js ./packages/web/

# 构建
RUN pnpm --filter @csa/web build

# -- 运行阶段 --
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/packages/web/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
