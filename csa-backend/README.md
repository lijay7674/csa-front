# CSA 官网系统 — 后端服务

> Computer Software Association · 学校计算机软件学会门户  
> Spring Boot 4.0.6 · Java 21 · MyBatis-Plus · MySQL 8 · JWT

---

## 1. 软件定位

CSA 官网后端是一个 **Maven 多模块聚合工程**，为学校计算机软件学会提供完整的 Web API 服务。系统包含：

| 能力 | 说明 |
|------|------|
| **对外展示** | 前台公开 API：学会简介、活动新闻、竞赛成果、优秀成员、技术资讯、历史题库、招新信息、联系我们 |
| **报名系统** | 无需登录，前台直接提交招新/活动/竞赛报名（含个人与团队报名），支持自助查询审核状态 |
| **后台管理** | 成员档案、干部任职、活动管理、竞赛管理（含获奖）、内容发布审核流、报名审核、题库与附件管理 |
| **AI 辅助** | AI 内容助手生成新闻/公告初稿，人工审核后发布，AI 不能绕过审核 |
| **权限控制** | 6 种角色（超级管理员/内容编辑/审核员/活动管理/竞赛管理/成员管理），JWT 认证，模块级权限 |

---

## 2. 环境与运行

### 2.1 环境要求

| 组件 | 版本要求 | 说明 |
|------|----------|------|
| JDK | **21+** | 推荐 Eclipse Temurin 21 |
| MySQL | **8.0+** | 字符集 utf8mb4 |
| Maven | **3.9+** | 用于编译打包 |
| MinIO | 可选 | 文件存储（题库附件），不使用则改 yaml 配置为本地存储 |

### 2.2 快速启动

```bash
# 1. 创建数据库并导入表结构
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS csa_portal DEFAULT CHARSET utf8mb4;"
mysql -u root -p csa_portal < csa-ddl.sql

# 2. 修改数据库连接信息（如果密码不是 root）
# 编辑 csa-server/src/main/resources/application.yaml
# 修改 spring.datasource.username 和 spring.datasource.password

# 3. 编译并启动（在工程根目录）
mvn clean install -DskipTests
mvn -pl csa-server spring-boot:run

# 4. 访问 Swagger API 文档
# http://localhost:8080/swagger-ui.html
```

### 2.3 默认管理员账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| `admin` | `admin123` | 超级管理员 |

> 密码使用 BCrypt 加密存储，首次启动后建议修改。

---

## 3. 使用说明

### 3.1 API 分组

| 前缀 | 认证 | 用途 |
|------|------|------|
| `/api/public/**` | 无 | 前台公开接口：浏览内容、提交报名、查询报名、下载题库 |
| `/api/admin/auth/**` | `/login` 无需认证 | 后台登录 |
| `/api/admin/**` | JWT Bearer Token | 后台管理接口 |

### 3.2 登录获取 Token

```bash
curl -X POST http://localhost:8080/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 返回: {"code":200,"data":{"token":"eyJhbG...","username":"admin"}}
```

### 3.3 调用后台接口

```bash
curl http://localhost:8080/api/admin/members?page=1&size=10 \
  -H "Authorization: Bearer eyJhbG..."
```

### 3.4 前台接口（无需 Token）

```bash
# 首页数据
curl http://localhost:8080/api/public/home

# 新闻列表
curl "http://localhost:8080/api/public/news?page=1&size=10"

# 提交报名
curl -X POST http://localhost:8080/api/public/registrations \
  -H "Content-Type: application/json" \
  -d '{"targetType":"招新","targetId":1,"regType":"个人","name":"张三","studentId":"2024001","phone":"13800138000"}'

# 查询报名状态
curl "http://localhost:8080/api/public/registrations/query?phone=13800138000"
```

### 3.5 Swagger 文档

启动后访问 `http://localhost:8080/swagger-ui.html`，所有 API 按 Tag 分组展示，可直接在线调试。后台接口调试时，先调用 `/api/admin/auth/login` 获取 Token，然后点击页面右上角 **Authorize** 按钮填入 `Bearer <token>` 即可。

---

## 4. 目录结构与架构原理

### 4.1 项目树

```
csa-backend/
├── pom.xml                         # 父 POM（统一依赖版本 + 模块声明）
│
├── csa-common/                     # ===== 共享层 =====
│   └── src/.../com/csa/common/
│       ├── R.java                  # 统一响应体 {code, message, data, timestamp}
│       ├── GlobalExceptionHandler.java  # 全局异常拦截 → R.fail()
│       └── enums/                  # 5 个状态枚举（报名/内容/竞赛/成员/栏目）
│
├── csa-module-auth/                # ===== 认证模块 =====
│   └── src/.../com/csa/auth/
│       ├── entity/                 # SysUser, SysRole, SysUserRole
│       ├── mapper/                 # MyBatis-Plus Mapper（含 findByUsername）
│       ├── dto/                    # LoginRequest, LoginResponse
│       ├── security/               # JwtUtil, JwtAuthenticationFilter, UserDetailsServiceImpl
│       └── controller/             # AuthController（/login, /me）
│
├── csa-module-member/              # ===== 成员管理 =====
│   └── com/csa/member/             # CsaMember + CsaCadre 完整 CRUD
│       ├── entity → mapper → service/impl → controller
│
├── csa-module-event/               # ===== 活动管理 =====
├── csa-module-competition/         # ===== 竞赛管理 + 获奖 =====
├── csa-module-content/             # ===== 内容管理 + 审核流 =====
├── csa-module-registration/        # ===== 报名系统 =====
├── csa-module-questionbank/        # ===== 题库 + 附件 =====
│
├── csa-module-ai/                  # ===== AI 写稿（可独立部署） =====
│   └── com/csa/ai/                 # AiController + GenerateRequest/PolishRequest
│
├── csa-module-aggregate/           # ===== 聚合查询层 =====
│   └── com/csa/aggregate/
│       ├── publicapi/              # 前台首页聚合 + 新闻/成果/成员/资讯/题库公开API
│       └── statistics/             # 多维度统计查询
│
├── csa-server/                     # ===== 启动模块 =====
│   ├── pom.xml                     # 依赖所有模块 + spring-boot-maven-plugin
│   └── src/.../com/csa/
│       ├── CsaApplication.java     # @SpringBootApplication 启动类
│       ├── config/                 # SecurityConfig, MyBatisPlusConfig, SwaggerConfig, CorsConfig
│       └── resources/
│           └── application.yaml    # 数据库/JWT/MinIO/VirtualThreads 配置
│
├── csa-ddl.sql                     # 完整建表脚本（12 张表 + 初始化数据）
└── README.md                       # 本文件
```

### 4.2 分层架构原理

```
┌─────────────────────────────────────────────────┐
│                   请求入口                        │
│   /api/public/*  (无认证)     /api/admin/* (JWT) │
└──────────────────────┬──────────────────────────┘
                       │
              ┌────────▼────────┐
              │  Controller 层   │  参数校验(@Valid)、路由映射、调用 Service
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │   Service 层     │  业务逻辑、状态机(审核流)、事务管理
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │   Mapper 层      │  MyBatis-Plus BaseMapper + 自定义 SQL
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │   Entity 层      │  ORM 映射 → MySQL 表
              └─────────────────┘
```

**关键设计**：
- **csa-common** 被所有模块依赖，提供统一的 `R<T>` 响应体和状态枚举
- **业务模块之间互相独立**，不直接调用对方的 Service，跨模块查询通过 **csa-module-aggregate** 聚合层完成
- **AI 模块零跨模块引用**，可随时替换为独立 Python 服务，只需修改 csa-server 的依赖
- **csa-server** 是唯一的启动入口，包含 SecurityConfig（JWT 过滤链）、MyBatisPlusConfig（分页插件 + 自动扫描所有模块 Mapper）、CORS 跨域配置

### 4.3 核心流程示例：内容审核发布

```
编辑器创建内容(status=草稿) → 点击"提交审核"(status=待审核)
    → 审核员查看待审列表 → 审核通过(status=已发布, 设置发布时间)
                         → 审核驳回(status=草稿, 附审核意见)
    → 已发布内容出现在前台 /api/public/news
    → 运营下线(status=已下线)
```

### 4.4 核心流程示例：报名与查询

```
学生访问前台 → 选择报名类型(招新/活动/竞赛)
    → 填写表单 → POST /api/public/registrations
    → 服务端生成唯一报名编号(REG+时间戳+随机数)
    → 去重校验(学号/手机号 + 目标组合)
    → 返回报名编号供学生记录
    → 学生随时通过 /api/public/registrations/query 查询审核进度
    → 管理员在后台审核、记录联系情况
```

---

## 5. 常见问题

### Q1: 启动报错 `Access denied for user 'root'@'localhost'`

修改 `csa-server/src/main/resources/application.yaml` 中的数据库用户名和密码：

```yaml
spring:
  datasource:
    username: 你的用户名
    password: 你的密码
```

### Q2: 启动报错 `Unknown database 'csa_portal'`

没有执行建库脚本。先运行：

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS csa_portal DEFAULT CHARSET utf8mb4;"
mysql -u root -p csa_portal < csa-ddl.sql
```

### Q3: IDEA 打开后模块没识别

确认是以 Maven 项目方式打开的（右键 `pom.xml` → Add as Maven Project）。  
如果子模块还是灰色，点击右侧 Maven 面板的刷新按钮（Reload All Maven Projects）。  
如果子模块的 Java 文件不识别为源码，右键子模块的 `src/main/java` → Mark Directory as → Sources Root。

### Q4: 登录时返回用户名或密码错误

默认密码是通过 INSERT 脚本写入的 BCrypt 密文。如果 SQL 中的密文与你本地生成的不匹配，请用以下方式重新生成：

```java
// 在任意 Java 环境中运行
System.out.println(new BCryptPasswordEncoder().encode("admin123"));
```

将输出替换 `csa-ddl.sql` 中 `sys_user` 表的 `password` 字段值，重新执行建表。

### Q5: JWT Token 过期了怎么办？

默认有效期 24 小时（`jwt.expiration: 86400000` 毫秒）。过期后重新调用 `/api/admin/auth/login` 获取新 Token。可修改 `application.yaml` 中的 `jwt.expiration` 调整有效期。

### Q6: 前端调用后台接口跨域报错

已配置 `CorsConfig` 允许所有来源。如果仍有问题，检查前端请求是否带了正确的 `Authorization: Bearer <token>` 请求头。预检请求（OPTIONS）不需要 Token。

### Q7: 题库附件上传后下载不了

默认存储路径为 `D:/csa-files/`，需确保该目录存在且有写入权限。如果使用 MinIO，修改 `application.yaml` 中的 `minio.*` 配置并确保 MinIO 服务已启动。

### Q8: AI 模块怎么用？

当前 AI 模块为占位实现（返回固定文本）。接入真实 LLM 的步骤：
1. 修改 `application.yaml` 中的 `ai.llm.*` 配置（endpoint、api-key、model）
2. 在 `AiController` 中替换占位逻辑为真实 HTTP 调用
3. AI 模块独立于其他模块，修改不影响主业务

### Q9: 怎么添加新的业务模块？

1. 在根目录新建 `csa-module-xxx` 目录
2. 复制一个现有模块的 `pom.xml`，修改 `artifactId`
3. 在父 `pom.xml` 的 `<modules>` 中添加新模块
4. 如果新模块需要被聚合层使用，在 `csa-module-aggregate/pom.xml` 和 `csa-server/pom.xml` 中添加依赖
5. 新模块的 Mapper 会被 `com.csa.**.mapper` 通配自动扫描，无需额外配置

### Q10: 如何启用 Virtual Threads？

已默认开启（`spring.threads.virtual.enabled: true`）。Tomcat 请求线程、`@Async` 异步任务、`@Scheduled` 定时任务全部运行在虚拟线程上，无需额外配置。如需关闭，改为 `false`。

---

## 相关文档

| 文档 | 路径 |
|------|------|
| 需求文档 | `D:\CSA\需求文档.md` |
| 建表脚本 | `D:\CSA\csa-ddl.sql` |
| 前端开发路线 | `D:\CSA\.workbuddy\artifacts\前端开发路线.md` |
| 后端开发路线 | `D:\CSA\.workbuddy\artifacts\后端开发路线.md` |
| 整体开发规划 | `D:\CSA\.workbuddy\artifacts\整体开发规划.md` |
| 前端设计提示词 | `D:\CSA\前端设计提示词卡.md` |
