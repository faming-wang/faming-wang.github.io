# DevLog — 软件工程师的技术博客

苹果官网风格的 Jekyll 博客，支持 GitHub Pages 一键部署。

## 项目结构

```
blog/
├── _config.yml          # Jekyll 配置
├── Gemfile              # GitHub Pages 依赖
├── index.html           # 首页（精选 + 文章列表 + 标签筛选）
├── tags.html            # 标签分类浏览
├── projects.html        # 开源项目展示
├── about.html           # 关于页面
├── feed.xml             # RSS 订阅
├── _layouts/            # Jekyll 布局模板
│   ├── default.html     # 基础布局（导航 + 页脚）
│   ├── post.html        # 文章详情布局
│   └── page.html        # 通用页面布局
├── _includes/           # 可复用组件
│   ├── header.html
│   ├── footer.html
│   ├── post-card.html
│   └── project-card.html
├── _posts/              # 文章（.md 文件）
│   └── YYYY-MM-DD-title.md
├── _projects/           # 项目（Jekyll collection）
│   └── project-id.md
└── assets/
    ├── css/style.css
    ├── js/app.js
    └── img/favicon.svg
```

## 本地预览

```bash
cd blog
bundle install
bundle exec jekyll serve
# 访问 http://localhost:4000
```

## GitHub Pages 部署

1. 将整个 `blog/` 目录内容推送到 `yourusername.github.io` 仓库的根目录
2. GitHub 会自动用 Jekyll 构建并部署
3. 无需额外配置（已包含 `.nojekyll` 和 `Gemfile`）

## 添加新文章

在 `_posts/` 目录新建 `.md` 文件，文件名格式 `YYYY-MM-DD-slug.md`：

```yaml
---
layout: post
title: "文章标题"
date: 2026-07-01
read_time: "10 分钟"
tags: [C++, Qt, 系统编程]
cover: cover-blue
cover_text: Cover
featured: false
excerpt: "文章摘要，显示在列表页"
---

文章正文（Markdown 格式）...
```

## 添加新项目

在 `_projects/` 目录新建 `.md` 文件：

```yaml
---
name: 项目名称
tagline: 一句话简介
description: 详细描述
tech: [TypeScript, React, Node.js]
tags: [全栈, 工具]
stars: 100
language: TypeScript
lang_color: "#3178c6"
color: cover-blue
url: https://github.com/user/repo
featured: false
---
```

## 封面颜色

可选值：`cover-blue` `cover-teal` `cover-purple` `cover-coral` `cover-amber` `cover-pink` `cover-gray` `cover-green`

## 语言颜色

| 语言 | lang_color |
|------|------------|
| TypeScript | `#3178c6` |
| C++ | `#f34b7d` |
| Rust | `#dea584` |
| Python | `#3572A5` |
| CMake | `#DA3434` |
