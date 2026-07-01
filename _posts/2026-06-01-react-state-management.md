---
layout: post
title: "2026 年的 React 状态管理：选哪个？"
date: 2026-06-01
read_time: "10 分钟"
tags: [React, TypeScript, 前端]
cover: cover-purple
cover_text: React
featured: false
excerpt: "从 Redux 到 Zustand，从 Jotai 到 TanStack Query，状态管理方案层出不穷。本文带你理清思路，根据场景选择最合适的工具。"
---

# 2026 年的 React 状态管理：选哪个？

React 的状态管理一直是前端开发中最让人困惑的领域之一。工具太多，选择太难。

## 核心原则：按状态类型分类

在选工具之前，先明确状态的类型：

1. **服务器状态**（Server State）：从 API 获取的数据，需要缓存、同步、失效
2. **客户端全局状态**（Global UI State）：主题、语言、用户偏好
3. **局部 UI 状态**（Local State）：弹窗开关、表单输入

> 不同类型的状态，用不同的工具管理。

## 服务器状态：TanStack Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000,  // 5分钟内认为数据新鲜
  })
  
  if (isLoading) return <Skeleton />
  return <div>{user?.name}</div>
}
```

TanStack Query 处理了缓存、重新获取、乐观更新等所有复杂逻辑，是服务器状态管理的最佳选择。

## 全局 UI 状态：Zustand

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppStore {
  theme: 'light' | 'dark'
  language: string
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (lang: string) => void
}

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'zh-CN',
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    { name: 'app-store' }
  )
)
```

Zustand 轻量、无样板代码，是 Redux 的绝佳替代品。

## 决策树

- 数据来自 API → **TanStack Query**
- 全局 UI 状态 → **Zustand**
- 组件间共享状态（小范围）→ **Context + useReducer**
- 单个组件内部 → **useState / useReducer**

## 总结

2026 年的最佳实践：**TanStack Query + Zustand + useState**，三者各司其职，覆盖所有场景。避免把服务器数据放进 Redux/Zustand——那是反模式。
