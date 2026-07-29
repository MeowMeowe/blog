# 后端 API 文档

## 概述

本项目使用 Next.js 14 App Router 的 API Routes 功能构建后端 API，使用 Prisma ORM 连接 MySQL 数据库，使用 NextAuth.js 进行身份认证。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **数据库**: MySQL 8.0+
- **ORM**: Prisma 5.22
- **认证**: NextAuth.js 4.24
- **密码加密**: bcryptjs
- **验证**: Zod (可选)

## 快速开始

### 1. 环境配置

复制 `.env.example` 到 `.env` 并填写配置：

```env
DATABASE_URL="mysql://username:password@localhost:3306/blog"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

生成 NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 2. 数据库初始化

```bash
# 创建数据库和表
mysql -u root -p < database/schema.sql

# 插入初始数据
mysql -u root -p < database/seed.sql

# 或者使用 Prisma
npx prisma db push
npx prisma db seed
```

### 3. 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

## API 端点

### 公开端点（无需认证）

#### 获取文章列表
```
GET /api/articles
```

**查询参数:**
- `page` (number, 默认: 1) - 页码
- `pageSize` (number, 默认: 10) - 每页数量
- `status` (string, 默认: 'published') - 文章状态
- `tag` (string) - 按标签筛选
- `search` (string) - 搜索标题或描述

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "articles": [
      {
        "id": 1,
        "title": "文章标题",
        "desc": "文章描述",
        "time": "2022-08-22",
        "icon": "React",
        "cover": "React",
        "view": 500,
        "star": 100,
        "tags": ["React", "前端开发"],
        "techStack": [
          {
            "icon": "React",
            "link": "https://react.dev/"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 50,
      "totalPages": 5
    }
  },
  "msg": "success"
}
```

#### 获取文章详情
```
GET /api/article/detail/[id]
```

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "文章标题",
    "desc": "文章描述",
    "content": "# Markdown 内容",
    "cover": "React",
    "icon": "React",
    "time": "2022-08-22",
    "createTime": "2022-08-22T00:00:00.000Z",
    "updateTime": "2022-08-22T00:00:00.000Z",
    "author": "MeowGod",
    "view": 501,
    "star": 100,
    "tags": ["React"],
    "techStack": [
      {
        "icon": "React",
        "name": "React",
        "link": "https://react.dev/"
      }
    ],
    "links": [
      {
        "title": "GitHub",
        "url": "https://github.com/...",
        "icon": "github",
        "type": "github"
      }
    ]
  },
  "msg": "success"
}
```

#### 获取所有标签
```
GET /api/tags
```

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "JavaScript",
      "slug": "javascript",
      "color": "#F7DF1E",
      "icon": "JS",
      "description": "JavaScript 编程语言"
    }
  ],
  "msg": "success"
}
```

### 认证端点

#### 登录
```
POST /api/auth/signin
```

**请求体:**
```json
{
  "email": "admin@meowgod.com",
  "password": "admin123"
}
```

#### 登出
```
POST /api/auth/signout
```

#### 获取会话
```
GET /api/auth/session
```

### 受保护端点（需要认证）

#### 创建文章
```
POST /api/articles/create
```

**权限**: Admin 或 Editor

**请求体:**
```json
{
  "title": "文章标题",
  "description": "文章描述",
  "content": "# Markdown 内容",
  "coverImage": "https://...",
  "tagIds": [1, 2],
  "techStackIds": [1, 2],
  "links": [
    {
      "title": "GitHub",
      "url": "https://github.com/...",
      "icon": "github",
      "type": "github"
    }
  ],
  "status": "PUBLISHED"
}
```

#### 更新文章
```
PUT /api/articles/[id]
```

**权限**: Admin 或 Editor

**请求体**: 同创建文章（所有字段可选）

#### 删除文章
```
DELETE /api/articles/[id]
```

**权限**: Admin

#### 创建标签
```
POST /api/tags
```

**权限**: Admin

**请求体:**
```json
{
  "name": "TypeScript",
  "slug": "typescript",
  "color": "#3178C6",
  "icon": "TS",
  "description": "TypeScript 编程语言"
}
```

## 错误响应

所有 API 端点使用统一的错误响应格式：

```json
{
  "code": 400,
  "data": null,
  "msg": "错误信息"
}
```

**常见错误码:**
- `400` - 请求参数错误
- `401` - 未认证
- `403` - 权限不足
- `404` - 资源未找到
- `500` - 服务器内部错误

## 认证流程

1. 用户通过 `/api/auth/signin` 登录
2. NextAuth.js 验证凭据并创建 JWT token
3. Token 存储在 HTTP-only cookie 中
4. 后续请求自动携带 cookie
5. Middleware 验证 token 并保护路由

## 数据库模型

详见 `prisma/schema.prisma` 文件。

主要模型：
- **User** - 用户
- **Article** - 文章
- **Tag** - 标签
- **TechStack** - 技术栈
- **ArticleTag** - 文章-标签关联
- **ArticleTechStack** - 文章-技术栈关联
- **ArticleLink** - 文章链接

## 开发工具

### Prisma Studio
可视化数据库管理工具：
```bash
npx prisma studio
```

### 数据库迁移
```bash
# 创建迁移
npx prisma migrate dev --name migration_name

# 应用迁移
npx prisma migrate deploy

# 重置数据库
npx prisma migrate reset
```

### 生成 Prisma Client
```bash
npx prisma generate
```

## 安全注意事项

1. **密码存储**: 使用 bcryptjs 进行哈希，不存储明文密码
2. **JWT Secret**: 使用强随机字符串作为 NEXTAUTH_SECRET
3. **CORS**: 根据需要配置 CORS 策略
4. **SQL 注入**: Prisma 自动防护 SQL 注入
5. **XSS**: Next.js 自动转义输出
6. **CSRF**: NextAuth.js 内置 CSRF 保护

## 性能优化

1. **数据库索引**: 已为常用查询字段添加索引
2. **连接池**: Prisma 自动管理连接池
3. **查询优化**: 使用 `include` 减少 N+1 查询
4. **缓存**: 可考虑添加 Redis 缓存层

## 部署

### 环境变量
确保在生产环境设置以下环境变量：
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

### 数据库
1. 创建生产数据库
2. 运行迁移: `npx prisma migrate deploy`
3. 生成 Prisma Client: `npx prisma generate`

### 构建
```bash
npm run build
npm start
```

## 故障排除

### Prisma Client 未生成
```bash
npx prisma generate
```

### 数据库连接失败
检查 `DATABASE_URL` 格式和数据库服务状态

### 认证失败
检查 `NEXTAUTH_SECRET` 和 `NEXTAUTH_URL` 配置

## 扩展功能

可以添加的功能：
- [ ] 文章评论系统
- [ ] 文件上传（图片、附件）
- [ ] 全文搜索（Elasticsearch）
- [ ] 缓存层（Redis）
- [ ] 邮件通知
- [ ] 社交媒体分享
- [ ] 文章草稿自动保存
- [ ] 版本历史
