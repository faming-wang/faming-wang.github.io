---
layout: post
title: "TypeScript 高级类型体操"
date: 2026-04-22
read_time: "11 分钟"
tags: [TypeScript, 前端]
cover: cover-green
cover_text: TS
featured: false
excerpt: "条件类型、infer、模板字面量类型——TypeScript 的类型系统其实是图灵完备的。本文带你深入类型级编程，解锁 TS 的真正潜力。"
---

# TypeScript 高级类型体操

TypeScript 的类型系统是图灵完备的——这意味着你可以用类型做很多你想不到的事。

## 条件类型

```typescript
type IsArray<T> = T extends any[] ? true : false;

type A = IsArray<number[]>;  // true
type B = IsArray<string>;    // false
```

## infer：从类型中提取

```typescript
// 提取函数返回值类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 提取 Promise 内部类型
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

// 提取数组元素类型
type ElementType<T> = T extends (infer E)[] ? E : never;

// 提取函数第一个参数
type FirstArg<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never;
```

## 模板字面量类型

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<'click'>;  // "onClick"
type ChangeEvent = EventName<'change'>; // "onChange"

// 实用工具：将对象 key 转为 camelCase getter
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

interface User { name: string; age: number; }
type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; }
```

## 递归类型

```typescript
// 深度 Readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
}

// 深度 Partial
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
}
```

## 实际应用：类型安全的事件系统

```typescript
interface Events {
  'user:login': { userId: string; timestamp: number };
  'user:logout': { userId: string };
  'post:created': { postId: string; title: string };
}

class TypedEventEmitter<T extends Record<string, any>> {
  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void { /* ... */ }
  emit<K extends keyof T>(event: K, data: T[K]): void { /* ... */ }
}

const emitter = new TypedEventEmitter<Events>();
emitter.on('user:login', ({ userId, timestamp }) => {
  // userId 和 timestamp 都有完整类型提示
  console.log(userId, timestamp);
});
```

TypeScript 的类型系统越深入，就越能感受到它的精妙。类型即文档，类型即约束。
