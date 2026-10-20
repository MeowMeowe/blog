# MeowGod Blog

Next.js 16.4.2、React 19、TypeScript、Prisma 5 与 MySQL 8 驱动的个人博客。

## 本地启动

推荐 Node.js 22.17.0（`nvm use`）、pnpm 10.12.4、Docker Desktop。

```bash
cp .env.example .env
# 填写数据库密码、NEXTAUTH_SECRET、ADMIN_PATH
pnpm install --frozen-lockfile
docker compose up -d
pnpm prisma generate
pnpm db:migrate
pnpm admin:create
pnpm dev
```

等 MySQL 健康后再执行迁移。现有数据库使用 `db:migrate` 做增量更新，保留现有文章；新建空数据库由 Compose 初始化结构和种子。

博客默认在 http://localhost:3000，后台为 `http://localhost:3000${ADMIN_PATH}/login`。后台路径必须是单段、至少 8 字符的字母、数字或连字符，未设置时本地回退到 `/backstage`。上线前设置随机入口；隐藏路径不代替登录与角色校验，内部 `/admin` 固定返回 404。

若 3000 被占用，可以临时使用：

```bash
NEXTAUTH_URL=http://127.0.0.1:3100 SITE_URL=http://127.0.0.1:3100 pnpm dev --hostname 127.0.0.1 --port 3100
```

## 内容维护

日常编辑以数据库和后台为准。`database/content.mjs` 与 `seed.sql` 是初始化材料，不会自动覆盖后台修改。文章支持：

- 草稿、发布、归档，发布时间可保留旧文章日期。
- 前台文章日期统一按北京时间展示，避免凌晨发布时显示为前一天。
- 封面、标签、技术栈、正文图片与相关链接；前台会展示这些字段。
- 按账号和文章隔离的本地草稿、离开提醒、加载失败重试。
- 版本冲突保护：两个窗口保存时后提交的旧版本返回 409，不覆盖新内容。
- 修改前快照、历史版本恢复、回收站。删除及回收站由管理员操作，恢复后为草稿，需检查后发布。
- 搜索、分页、只读编辑权限提示；标签和技术栈由管理员维护。
- 账号资料、密码修改。改密、管理员密码轮换会撤销全部旧会话。
- 图片上传与媒体库：单图最多 5 MB、最多 4000 万像素，JPEG/PNG/WebP/GIF 重编码为 WebP，去除元数据；GIF 取首帧。每账号每分钟最多 20 次上传，最多保存 2000 张。
- 管理员可导出内容 JSON，不含用户密码；这份内容导出不是完整数据库备份。

浏览器草稿只在当前浏览器中保留，不能替代服务器备份。历史版本恢复也会保留恢复前的服务器快照；被删除的标签或技术栈可能导致旧快照无法恢复，需要先补回对应分类。

不要在日常启动或部署时运行种子同步。以下命令会明确覆盖数据，必须先备份：

```bash
pnpm content:seed                   # 只重新生成种子 SQL
pnpm content:sync -- --replace      # 替换全部文章，包含历史版本和回收站
pnpm content:sync-one -- 1 --content-only --expected-version=0 # 仅更新标题、摘要和正文，保留历史版本及发布信息；版本号以数据库当前值为准
pnpm content:sync-one -- 1 --overwrite # 完整种子替换（会覆盖发布状态、时间与关联），先备份，勿用于日常润色
```

## 校验和回归

```bash
pnpm check            # 类型检查、Lint、安全单测、生产构建
pnpm build            # Webpack 生产构建
pnpm start            # 运行生产构建
pnpm db:migrate       # 可重复执行的增量迁移
pnpm admin:create     # 创建/轮换 .env 中指定的本地管理员
pnpm audit --prod --registry=https://registry.npmjs.org
# 先运行本地博客，再执行接口回归；使用临时账号和临时文章，完成后清理
TEST_BASE_URL=http://127.0.0.1:3100 node --env-file=.env --test tests/api.integration.test.mjs
```

开发使用 Turbopack；生产构建使用 Webpack。Sass 编译使用 `sass-embedded`，Next 负责文件监听，已移除未使用的 Sass 独立 CLI 原生监听依赖。不要依赖此安装运行独立的 `sass --watch`。

CI 工作流只执行校验，使用独立 MySQL 服务，不读取正式数据库密钥、不向服务器部署。尚未在 GitHub 远端运行；服务器与部署流水线留待后续接入。

## 备份和恢复

```bash
pnpm db:backup
pnpm db:restore -- .backups/某次备份.json --confirm-db blog --dry-run
# 恢复到空库；先确保该库结构已初始化
pnpm db:restore -- .backups/某次备份.json --confirm-db blog
# 非空库须再明确指定 --replace，事务内整体替换
```

备份写入 `.backups/`，权限 0600，包含账号和密码哈希，需要私密保存。还应单独备份 `MEDIA_ROOT`（默认 `.storage/media`）的媒体文件。两者均已排除 Git。恢复要求明确数据库名称；`--dry-run` 只检查备份封装和记录数量，不能替代隔离库恢复演练。恢复后旧会话失效，重启应用并重新登录。

## 安全与上线边界

认证使用 12 小时 JWT 和数据库会话版本；每次管理操作重查角色。写 API 检查 Origin/Fetch Metadata、JSON 格式、输入大小和关联内容。文章 HTML 写入/读取双重净化；图片经过实际解码与重编码，拒绝 SVG 及伪装图片。公开接口不返回草稿、归档或回收站内容。阅读计数使用独立 POST、10 分钟内去重，不改变文章修改时间。

生产依赖审计目前无已知漏洞。完整开发依赖审计还剩 ESLint 的 fast-glob → micromatch → braces 一条上游未修复告警（[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)）；它处理本地文件匹配，不用于线上请求，仍保留在审计结果中。

`SITE_URL` 设置公开网址，供 canonical、Open Graph、sitemap 和 RSS 使用；`NEXTAUTH_URL` 设置实际认证源。robots/sitemap 不包含隐藏后台路径。安全响应头包含 CSP、防嵌套、nosniff 等，数据库仅监听回环地址。

上线前仍需：真实域名与 HTTPS、独立密钥、数据库最小权限、媒体持久化与异地备份、反向代理请求大小限制和日志。代理必须覆盖客户端传入的 X-Forwarded-For / X-Real-IP，防止伪造限流标识；多实例需要共享限流存储。目前限流与阅读去重是单进程内存实现。

## 目录

```text
app/        前台、后台和 API
lib/        认证、校验、内容查询、媒体处理
prisma/     数据模型
database/   初始化结构与种子文章
scripts/    增量迁移、备份恢复、管理员及种子工具
tests/      安全单测与本地接口回归
public/     静态资源
```
