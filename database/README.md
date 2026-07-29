# 数据库设置说明

## 概述

本项目使用 MySQL 数据库存储博客数据，包括文章、用户、标签、技术栈等信息。

## 数据库要求

- **数据库类型**: MySQL 8.0 或更高版本
- **字符集**: utf8mb4
- **排序规则**: utf8mb4_unicode_ci

## 快速开始

### 1. 创建数据库

```bash
# 登录 MySQL
mysql -u root -p

# 执行建表脚本
source /path/to/blog/database/schema.sql

# 执行初始化数据脚本
source /path/to/blog/database/seed.sql
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并填写数据库连接信息：

```env
DATABASE_URL="mysql://username:password@localhost:3306/blog"
```

### 3. 使用 Prisma 同步

如果使用 Prisma ORM（推荐）：

```bash
# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 同步数据库（可选，如果已执行 schema.sql 则不需要）
npx prisma db push
```

## 表结构说明

### users（用户表）
存储管理员和编辑者信息。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| username | VARCHAR(50) | 用户名（唯一） |
| email | VARCHAR(100) | 邮箱（唯一） |
| password_hash | VARCHAR(255) | 密码哈希 |
| role | ENUM | 角色：admin/editor/viewer |

### articles（文章表）
存储博客文章主要信息。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| title | VARCHAR(255) | 文章标题 |
| description | TEXT | 文章摘要 |
| content | LONGTEXT | 文章内容（Markdown） |
| status | ENUM | 状态：draft/published/archived |
| view_count | INT | 浏览次数 |
| star_count | INT | 点赞数 |

### tags（标签表）
存储文章标签。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| name | VARCHAR(50) | 标签名称 |
| slug | VARCHAR(50) | URL友好名称 |
| color | VARCHAR(20) | 标签颜色 |
| icon | VARCHAR(50) | 标签图标 |

### tech_stack（技术栈表）
存储技术栈信息。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| name | VARCHAR(50) | 技术名称 |
| icon | VARCHAR(50) | 图标标识 |
| link | VARCHAR(500) | 官方链接 |

### 关联表

- **article_tags**: 文章-标签多对多关联
- **article_tech_stack**: 文章-技术栈多对多关联
- **article_links**: 文章外部链接

## 初始数据

执行 `seed.sql` 后，数据库将包含：

- **2个管理员用户**
  - 用户名: `admin` / 邮箱: `admin@meowgod.com`
  - 用户名: `meowgod` / 邮箱: `meow@meowgod.com`
  - 默认密码: `admin123` （⚠️ 生产环境请立即修改）

- **12个预设标签**
  - JavaScript, TypeScript, React, Next.js, Node.js, CSS, Sass 等

- **12个预设技术栈**
  - JavaScript, React, Node.js, Express, Prisma, MySQL 等

- **5篇示例文章**
  - 从原 `data.ts` 迁移的文章数据

## 安全注意事项

> ⚠️ **重要**: 初始化脚本中的密码哈希是示例值，不能直接使用！

### 生成真实的密码哈希

使用以下 Node.js 代码生成：

```javascript
const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'your-secure-password';
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
}

generateHash();
```

然后更新 `seed.sql` 中的 `password_hash` 字段。

## 数据库管理工具

推荐使用以下工具管理数据库：

1. **Prisma Studio** (推荐)
   ```bash
   npx prisma studio
   ```

2. **MySQL Workbench**
   - 官方 GUI 工具

3. **phpMyAdmin**
   - Web 界面管理工具

4. **DBeaver**
   - 跨平台数据库工具

## 备份和恢复

### 备份数据库

```bash
mysqldump -u username -p blog > backup.sql
```

### 恢复数据库

```bash
mysql -u username -p blog < backup.sql
```

## 常见问题

### Q: 如何重置数据库？

```bash
# 删除所有表
mysql -u root -p -e "DROP DATABASE blog; CREATE DATABASE blog;"

# 重新执行脚本
mysql -u root -p blog < database/schema.sql
mysql -u root -p blog < database/seed.sql
```

### Q: 如何修改管理员密码？

```sql
-- 使用 bcrypt 生成新密码哈希后
UPDATE users SET password_hash = 'new-hash-here' WHERE username = 'admin';
```

### Q: 数据库连接失败？

检查以下内容：
1. MySQL 服务是否运行
2. `.env` 文件中的连接信息是否正确
3. 数据库用户是否有足够权限
4. 防火墙是否允许连接

## 性能优化建议

1. **索引优化**: 已为常用查询字段添加索引
2. **连接池**: 使用 Prisma 的连接池管理
3. **查询优化**: 避免 N+1 查询，使用 JOIN
4. **缓存**: 考虑使用 Redis 缓存热门文章

## 下一步

完成数据库设置后，请继续：
1. 配置 Prisma ORM
2. 实现 API 路由
3. 测试数据库连接
