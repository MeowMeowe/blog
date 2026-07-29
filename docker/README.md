# Docker 数据库快速启动指南

## 启动数据库

```bash
# 启动 MySQL 容器（会自动创建数据库和表）
docker-compose up -d

# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f mysql
```

## 数据库信息

- **主机**: localhost
- **端口**: 3306
- **数据库名**: blog
- **用户名**: bloguser
- **密码**: blogpass123
- **Root 密码**: root123

## 连接字符串

已配置在 `.env` 文件中：
```
DATABASE_URL="mysql://bloguser:blogpass123@localhost:3306/blog"
```

## 默认管理员账户

- **邮箱**: admin@meowgod.com
- **密码**: admin123

或

- **邮箱**: meow@meowgod.com
- **密码**: admin123

## 停止和清理

```bash
# 停止容器
docker-compose down

# 停止并删除数据卷（会清空所有数据）
docker-compose down -v
```

## 重新初始化数据库

```bash
# 停止并删除数据
docker-compose down -v

# 重新启动（会重新执行初始化脚本）
docker-compose up -d
```

## 直接连接数据库

```bash
# 使用 MySQL 客户端连接
mysql -h 127.0.0.1 -u bloguser -pblogpass123 blog

# 或使用 Docker exec
docker exec -it blog_mysql mysql -u bloguser -pblogpass123 blog
```

## 验证数据

```sql
-- 查看所有表
SHOW TABLES;

-- 查看用户
SELECT id, username, email, role FROM users;

-- 查看文章
SELECT id, title, status FROM articles;

-- 查看标签
SELECT id, name, slug FROM tags;
```

## 故障排除

### 端口被占用
如果 3306 端口被占用，修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "3307:3306"  # 使用 3307 端口
```

然后更新 `.env` 中的连接字符串：
```
DATABASE_URL="mysql://bloguser:blogpass123@localhost:3307/blog"
```

### 容器无法启动
```bash
# 查看详细日志
docker-compose logs mysql

# 检查容器状态
docker-compose ps
```
