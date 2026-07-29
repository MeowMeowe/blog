# GitHub Actions 配置说明

## 概述

本项目使用 GitHub Actions 实现 Next.js 应用的自动化部署。

## 工作流程

1. **代码检出** - 获取最新代码
2. **环境设置** - Node.js 20.x + pnpm 8
3. **依赖缓存** - 加速构建过程
4. **安装依赖** - `pnpm install`
5. **环境变量** - 从 GitHub Secrets 创建 `.env`
6. **Prisma 生成** - 生成数据库客户端
7. **代码检查** - ESLint（不阻塞部署）
8. **构建项目** - `pnpm build`
9. **部署到服务器** - SSH 部署
10. **服务器脚本** - 安装依赖并重启 PM2

## 需要配置的 GitHub Secrets

在 GitHub 仓库的 Settings → Secrets and variables → Actions 中添加以下密钥：

### 服务器相关
- `SSH_HOST` - 服务器 IP 或域名
- `SSH_NAME` - SSH 用户名
- `TENTCENT_BLOG` - SSH 私钥（完整内容）

### 环境变量
- `DATABASE_URL` - 数据库连接字符串
  ```
  mysql://用户名:密码@主机:端口/数据库名
  ```
- `NEXTAUTH_SECRET` - NextAuth 密钥（使用 `openssl rand -base64 32` 生成）
- `NEXTAUTH_URL` - 应用 URL（如 `https://blog.example.com`）
- `NEXT_PUBLIC_API_URL` - API 基础 URL（可选，留空则使用相对路径）

## 服务器要求

### 必需软件
- Node.js 18+ (推荐 20.x)
- pnpm 8+
- PM2 (进程管理器)
- MySQL 8.0+

### 服务器设置

1. **安装 Node.js (使用 nvm)**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

2. **安装 pnpm**
```bash
npm install -g pnpm
```

3. **安装 PM2**
```bash
npm install -g pm2
pm2 startup  # 设置开机自启
```

4. **创建部署目录**
```bash
mkdir -p /usr/local/meow/blog
```

5. **配置数据库**
- 确保 MySQL 运行并可访问
- 创建数据库和用户
- 运行数据库迁移

## 部署流程

### 自动部署
推送到 `main` 分支会自动触发部署：
```bash
git push origin main
```

### 手动部署
在 GitHub Actions 页面手动触发工作流。

## PM2 管理命令

在服务器上管理应用：

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs blog

# 重启应用
pm2 restart blog

# 停止应用
pm2 stop blog

# 删除应用
pm2 delete blog

# 保存 PM2 配置
pm2 save
```

## 故障排查

### 构建失败
1. 检查 Node.js 版本是否正确
2. 确认所有依赖已安装
3. 检查环境变量是否正确设置

### 部署失败
1. 验证 SSH 密钥配置
2. 确认服务器路径存在
3. 检查服务器磁盘空间

### 应用无法启动
1. 查看 PM2 日志：`pm2 logs blog`
2. 检查数据库连接
3. 验证环境变量

## 优化建议

### 1. 添加测试步骤
```yaml
- name: Run Tests
  run: pnpm test
```

### 2. 添加数据库迁移
```yaml
- name: Run Migrations
  run: pnpm prisma migrate deploy
```

### 3. 添加健康检查
```yaml
- name: Health Check
  run: curl -f https://your-domain.com/api/health || exit 1
```

### 4. 添加回滚机制
保留上一个版本的构建，失败时可以快速回滚。

## 安全注意事项

1. ✅ 不要在代码中硬编码密钥
2. ✅ 使用 GitHub Secrets 存储敏感信息
3. ✅ 定期更新 SSH 密钥
4. ✅ 限制 SSH 访问权限
5. ✅ 使用防火墙保护服务器

## 监控和日志

- GitHub Actions 日志：查看构建和部署过程
- PM2 日志：`pm2 logs blog`
- 应用日志：检查 Next.js 日志输出
- 服务器日志：`/var/log/` 目录

## 相关文档

- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [PM2 文档](https://pm2.keymetrics.io/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
