---
layout: post
title: "C++20 协程：从原理到实践"
date: 2026-06-15
read_time: "15 分钟"
tags: [C++, 系统编程, 并发]
cover: cover-teal
cover_text: C++
featured: true
excerpt: "C++20 引入了原生协程支持，彻底改变了异步编程的写法。本文深入解析协程的挂起机制、Promise 接口，以及如何构建自己的协程框架。"
---

# C++20 协程：从原理到实践

C++20 的协程是近年来 C++ 最重要的语言特性之一。它让我们能以同步的写法处理异步逻辑，极大提升了代码可读性。

## 什么是协程？

协程是一种可以**暂停执行并在稍后恢复**的函数。与线程不同，协程的切换完全在用户态进行，没有内核上下文切换的开销。

```cpp
#include <coroutine>
#include <iostream>

struct Task {
    struct promise_type {
        Task get_return_object() { return {}; }
        std::suspend_never initial_suspend() { return {}; }
        std::suspend_never final_suspend() noexcept { return {}; }
        void return_void() {}
        void unhandled_exception() {}
    };
};

Task hello_coroutine() {
    std::cout << "Hello, ";
    co_await std::suspend_always{};  // 暂停点
    std::cout << "Coroutine!\n";
}
```

## 三个关键字

C++20 协程引入了三个新关键字：

- **`co_await`**：暂停当前协程，等待一个 awaitable 对象
- **`co_yield`**：产出一个值并暂停（用于生成器）
- **`co_return`**：协程正常结束并可选地返回一个值

## 实现一个生成器

```cpp
#include <coroutine>
#include <optional>

template<typename T>
struct Generator {
    struct promise_type {
        std::optional<T> current_value;
        
        Generator get_return_object() {
            return Generator{std::coroutine_handle<promise_type>::from_promise(*this)};
        }
        std::suspend_always initial_suspend() { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }
        std::suspend_always yield_value(T value) {
            current_value = value;
            return {};
        }
        void return_void() {}
        void unhandled_exception() { std::terminate(); }
    };
    
    using Handle = std::coroutine_handle<promise_type>;
    Handle handle;
    
    Generator(Handle h) : handle(h) {}
    ~Generator() { if (handle) handle.destroy(); }
    
    bool next() {
        handle.resume();
        return !handle.done();
    }
    
    T value() { return *handle.promise().current_value; }
};

// 使用生成器
Generator<int> fibonacci() {
    int a = 0, b = 1;
    while (true) {
        co_yield a;
        auto next = a + b;
        a = b;
        b = next;
    }
}

int main() {
    auto fib = fibonacci();
    for (int i = 0; i < 10 && fib.next(); ++i) {
        std::cout << fib.value() << " ";
    }
    // 输出: 0 1 1 2 3 5 8 13 21 34
}
```

## 协程的性能优势

在异步 I/O 场景中，协程相比回调和线程有明显优势：

| 方案 | 代码复杂度 | 内存开销 | 切换开销 |
|------|-----------|---------|---------|
| 回调地狱 | 极高 | 低 | 无 |
| 线程池 | 中 | 高（每线程 MB 级栈） | 高（内核切换）|
| 协程 | 低 | 极低（KB 级帧）| 极低（用户态）|

## 总结

C++20 协程是一个框架，而不是一个完整的解决方案。理解 Promise 接口是掌握协程的关键。实际使用中，推荐使用成熟的协程库（如 cppcoro、libcoro）而不是从头实现。
