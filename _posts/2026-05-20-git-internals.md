---
layout: post
title: "Git 内部原理：对象模型与引用"
date: 2026-05-20
read_time: "14 分钟"
tags: [Git, 工程实践]
cover: cover-amber
cover_text: Git
featured: false
excerpt: "你每天都在用 Git，但你知道 .git 目录里藏着什么吗？本文深入 Git 的对象存储、DAG 结构和引用机制，帮你真正理解 Git。"
---

# Git 内部原理：对象模型与引用

Git 是内容寻址的文件系统。理解这一点，是真正掌握 Git 的关键。

## 四种对象类型

Git 的 `.git/objects` 目录存储四种对象，每个对象用其内容的 SHA-1 哈希命名：

### 1. Blob（文件内容）

```bash
# 手动创建一个 blob 对象
echo "Hello, Git!" | git hash-object -w --stdin
# 输出: 8ab686eafeb1f44702738c8b0f24f2567c36da6d

# 读取它的内容
git cat-file -p 8ab686ea
# 输出: Hello, Git!
```

### 2. Tree（目录结构）

Tree 对象描述一个目录的快照：

```
100644 blob a1b2c3d4... README.md
100644 blob e5f6a7b8... main.cpp
040000 tree c9d0e1f2... src/
```

### 3. Commit（提交）

```bash
git cat-file -p HEAD
# tree 4b825dc...
# parent a1b2c3d...
# author Dev <dev@example.com> 1719590400 +0800
# committer Dev <dev@example.com> 1719590400 +0800
# 
# feat: add cache system
```

### 4. Tag（标签对象）

指向特定 commit 的永久引用，可附带额外元信息。

## 引用（References）

引用是指向对象哈希的命名指针：

```bash
# HEAD 通常是一个符号引用，指向当前分支
cat .git/HEAD
# ref: refs/heads/main

# 分支就是指向 commit 的文件
cat .git/refs/heads/main
# a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0
```

## 理解 rebase vs merge

理解了对象模型，就能真正理解 rebase：

- **merge**：创建一个新的 merge commit，有两个 parent
- **rebase**：以目标分支为 base，重新 apply 当前分支的每一个 commit（生成新的 commit 对象）

这就是为什么 rebase 之后 commit hash 会变——它们是全新的对象。

## 总结

Git 的强大来自其简洁的底层设计：一切皆对象，引用指向对象。理解这个模型，git reset、git rebase、git reflog 都会变得透明。
