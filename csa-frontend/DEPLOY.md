# CSA 部署指南

## 快速选择

| 如果你... | 选这个 |
|-----------|--------|
| 有自己的服务器 + 想统一管理所有服务 | **方案 A: Docker Compose** |
| 不想管服务器 + 想要免费 CDN + HTTPS | **方案 B: Vercel** |
| 腾讯云用户，想用国内 CDN | 方案 C: EdgeOne Pages |

---

## 方案 A: Docker Compose（推荐有服务器的用户）

### 目录结构

```
CSA/
├── csa-frontend/
│   ├── Dockerfile          # 前端镜像
│   ├── nginx.conf          # Nginx 配置（含 API 代理）
│   └── docker-compose.yml  # 一键编排
├── csa-backend/
│   └── Dockerfile          # 后端镜像（需自行创建）
└── csa-ddl.sql             # 数据库初始化脚本
```

### 部署步骤

```bash
# 1. 进入前端目录
cd CSA/csa-frontend

# 2. 一键启动（后端 + 数据库 + 前端）
docker compose up -d

# 3. 查看状态
docker compose ps

# 4. 查看日志
docker compose logs -f
```

### 访问

| 服务 | 地址 |
|------|------|
| 前台网站 | `http://服务器IP` |
| 后端 API | `http://服务器IP:8080/api` |
| Swagger | `http://服务器IP:8080/swagger-ui.html` |

### 更新部署

```bash
git pull
docker compose build frontend
docker compose up -d frontend
```

---

## 方案 B: Vercel（推荐不想管服务器的用户）

> Vercel 免费额度：100GB 带宽/月, 6000 分钟构建/月 — 学生社团完全够用

### 方式 1：Vercel CLI（最简单）

```bash
# 安装
npm i -g vercel

# 在项目目录执行
cd CSA/csa-frontend
vercel

# 按提示操作：
# - Set up and deploy? → Y
# - Which scope? → 选你的账号
# - Link to existing project? → N
# - Project name? → csa-website
# - In which directory is your code? → ./
# - Override settings? → N
```

### 方式 2：Git 自动部署

1. 把代码推到 GitHub/GitLab
2. 打开 [vercel.com](https://vercel.com) → New Project
3. 导入仓库，Vercel 会自动识别 Vite 项目
4. 设置：
   - **Root Directory**: `csa-frontend`（如果在 monorepo 根目录）
   - **Build Command**: `npx pnpm --filter @csa/web build`
   - **Output Directory**: `packages/web/dist`
   - **Install Command**: `npx pnpm install`
5. 部署后每次 `git push` 自动上线

### 前端环境变量（Vercel 控制台设置）

```
VITE_API_BASE_URL = https://你的后端服务器地址/api
```

### 注意事项

- 前端 Vercel，后端独立部署（你的服务器上 Docker 跑后端）
- CORS 需要在后端配置允许前端域名
- 后端 Spring Security 的 `SecurityConfig.java` 加:

```java
// CORS 配置
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("https://你的域名.vercel.app"));
    config.setAllowedMethods(List.of("*"));
    config.setAllowedHeaders(List.of("*"));
    CorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    ((UrlBasedCorsConfigurationSource) source).registerCorsConfiguration("/**", config);
    return source;
}
```

---

## 方案 C: EdgeOne Pages（腾讯云）

类似 Vercel，适合国内访问速度需求。

```bash
# CLI 部署
npm i -g @tencent/edgeone
edgeone deploy
```

---

## 后端 Dockerfile 参考

如果你还没写后端的 Dockerfile：

```dockerfile
# csa-backend/Dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY csa-server/target/csa-server-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

构建前需要先在 IDEA 里 `mvn package -DskipTests` 生成 jar 包。

---

## CORS 配置提醒

前后端分域名部署时必须配 CORS。在 `csa-backend/csa-server/.../SecurityConfig.java` 的 `SecurityFilterChain` 方法前加：

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(List.of("*")); // 生产环境改为具体域名
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

并在 `.cors(corsConfigurationSource())` 之前 `.csrf(csrf -> csrf.disable())`。
