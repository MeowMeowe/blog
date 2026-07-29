-- ============================================
SET NAMES utf8mb4;
-- 博客系统数据库表结构
-- 数据库类型: MySQL 8.0+
-- 字符集: utf8mb4
-- 排序规则: utf8mb4_unicode_ci
-- ============================================

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS blog 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE blog;

-- ============================================
-- 1. 用户表 (users)
-- 用于存储管理员和编辑者信息
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名（唯一）',
  email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱（唯一）',
  password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希值（bcrypt）',
  display_name VARCHAR(100) COMMENT '显示名称',
  avatar_url VARCHAR(500) COMMENT '头像URL',
  role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer' COMMENT '用户角色：admin-管理员, editor-编辑者, viewer-访客',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ============================================
-- 2. 文章表 (articles)
-- 存储博客文章的主要信息
-- ============================================
CREATE TABLE IF NOT EXISTS articles (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '文章ID',
  title VARCHAR(255) NOT NULL COMMENT '文章标题',
  description TEXT COMMENT '文章描述/摘要',
  content LONGTEXT NOT NULL COMMENT '文章内容（Markdown格式）',
  cover_image VARCHAR(500) COMMENT '封面图片URL',
  author_id INT COMMENT '作者ID',
  view_count INT DEFAULT 0 COMMENT '浏览次数',
  star_count INT DEFAULT 0 COMMENT '点赞数',
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft' COMMENT '文章状态：draft-草稿, published-已发布, archived-已归档',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  published_at TIMESTAMP NULL COMMENT '发布时间',
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_published_at (published_at),
  INDEX idx_author_id (author_id),
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- ============================================
-- 3. 标签表 (tags)
-- 存储文章标签信息
-- ============================================
CREATE TABLE IF NOT EXISTS tags (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '标签ID',
  name VARCHAR(50) NOT NULL UNIQUE COMMENT '标签名称（唯一）',
  slug VARCHAR(50) NOT NULL UNIQUE COMMENT 'URL友好的标签名（唯一）',
  color VARCHAR(20) COMMENT '标签颜色（HEX或颜色名）',
  icon VARCHAR(50) COMMENT '标签图标标识',
  description TEXT COMMENT '标签描述',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_slug (slug),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- ============================================
-- 4. 文章-标签关联表 (article_tags)
-- 多对多关系：一篇文章可以有多个标签
-- ============================================
CREATE TABLE IF NOT EXISTS article_tags (
  article_id INT NOT NULL COMMENT '文章ID',
  tag_id INT NOT NULL COMMENT '标签ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '关联创建时间',
  PRIMARY KEY (article_id, tag_id),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章-标签关联表';

-- ============================================
-- 5. 技术栈表 (tech_stack)
-- 存储技术栈信息（如React、Node.js等）
-- ============================================
CREATE TABLE IF NOT EXISTS tech_stack (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '技术栈ID',
  name VARCHAR(50) NOT NULL UNIQUE COMMENT '技术名称（唯一）',
  icon VARCHAR(50) COMMENT '图标标识',
  link VARCHAR(500) COMMENT '官方网站或文档链接',
  description TEXT COMMENT '技术描述',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='技术栈表';

-- ============================================
-- 6. 文章-技术栈关联表 (article_tech_stack)
-- 多对多关系：一篇文章可以使用多个技术栈
-- ============================================
CREATE TABLE IF NOT EXISTS article_tech_stack (
  article_id INT NOT NULL COMMENT '文章ID',
  tech_id INT NOT NULL COMMENT '技术栈ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '关联创建时间',
  PRIMARY KEY (article_id, tech_id),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (tech_id) REFERENCES tech_stack(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章-技术栈关联表';

-- ============================================
-- 7. 文章链接表 (article_links)
-- 存储文章相关的外部链接（如GitHub、Demo等）
-- ============================================
CREATE TABLE IF NOT EXISTS article_links (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '链接ID',
  article_id INT NOT NULL COMMENT '文章ID',
  title VARCHAR(100) COMMENT '链接标题',
  url VARCHAR(500) NOT NULL COMMENT '链接URL',
  icon VARCHAR(50) COMMENT '链接图标',
  link_type ENUM('github', 'demo', 'docs', 'other') DEFAULT 'other' COMMENT '链接类型',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_article_id (article_id),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章链接表';

-- ============================================
-- 索引优化说明
-- ============================================
-- 1. 所有外键字段都已添加索引以提升查询性能
-- 2. 常用查询字段（如 status, created_at, email 等）已添加索引
-- 3. 唯一约束字段（如 username, email, slug）自动创建唯一索引
-- 4. 关联表使用复合主键，自动创建索引

-- ============================================
-- 使用说明
-- ============================================
-- 1. 执行此脚本前，请确保 MySQL 版本 >= 8.0
-- 2. 建议使用独立的数据库用户，并授予适当权限
-- 3. 生产环境请修改默认字符集和排序规则（如需要）
-- 4. 执行后请运行 seed.sql 插入初始数据
