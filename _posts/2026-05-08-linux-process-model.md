---
layout: post
title: "Linux 进程模型深度解析"
date: 2026-05-08
read_time: "16 分钟"
tags: [Linux, 系统编程, 操作系统]
cover: cover-coral
cover_text: Linux
featured: false
excerpt: "fork、exec、wait——每个 Linux 开发者都用过这些系统调用，但你真的理解它们背后的工作原理吗？深入内核，理解进程的本质。"
---

# Linux 进程模型深度解析

进程是操作系统资源分配的基本单位。理解 Linux 进程模型，是系统编程的必备基础。

## fork() 的写时复制

```c
#include <unistd.h>
#include <stdio.h>

int main() {
    int x = 42;
    pid_t pid = fork();
    
    if (pid == 0) {
        // 子进程
        x = 100;  // 修改自己的副本，不影响父进程
        printf("Child: x = %d, pid = %d\n", x, getpid());
    } else {
        // 父进程
        wait(NULL);
        printf("Parent: x = %d, pid = %d\n", x, getpid());
    }
    return 0;
}
```

`fork()` 使用 **Copy-on-Write（COW）** 优化：子进程创建时共享父进程的内存页，只有在修改时才真正复制。

## exec 系列函数

`exec` 用新程序替换当前进程的地址空间：

```c
// execve 是最底层的系统调用
// 常见 shell 实现 = fork() + exec() + wait()
pid_t pid = fork();
if (pid == 0) {
    char* args[] = {"/bin/ls", "-la", NULL};
    execve("/bin/ls", args, environ);
    // 执行到这里说明 exec 失败
    perror("exec failed");
    exit(1);
}
wait(NULL);
```

## 信号机制

信号是进程间通信的简单方式：

```c
#include <signal.h>

void sigint_handler(int sig) {
    printf("\nCaught SIGINT, cleaning up...\n");
    // 执行清理操作
    exit(0);
}

int main() {
    signal(SIGINT, sigint_handler);
    while (1) pause();  // 等待信号
}
```

## 进程状态转换

Linux 进程在以下状态间转换：

- **R**（Running/Runnable）：正在运行或就绪队列中
- **S**（Interruptible Sleep）：等待事件，可被信号唤醒
- **D**（Uninterruptible Sleep）：等待 I/O，不可被信号打断
- **Z**（Zombie）：已退出但父进程未 wait
- **T**（Stopped）：被 SIGSTOP 暂停

## 避免僵尸进程

```c
// 方法1：忽略 SIGCHLD
signal(SIGCHLD, SIG_IGN);

// 方法2：双 fork（孙进程被 init 收养）
if (fork() == 0) {
    if (fork() > 0) exit(0);  // 子进程立即退出
    // 孙进程继续运行，由 init(pid=1) 负责 wait
}
```

理解这些机制，是编写健壮系统程序的基础。
