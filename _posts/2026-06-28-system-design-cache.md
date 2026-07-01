---
layout: post
title: "系统设计：缓存策略全解析"
date: 2026-06-28
read_time: "12 分钟"
tags: [系统设计, 分布式]
cover: cover-blue
cover_text: Cache
featured: true
excerpt: "深入探讨缓存的各种策略，从 Cache-Aside 到 Write-Through，从本地缓存到分布式缓存，带你全面理解缓存设计的权衡与取舍。"
---

# 系统设计：缓存策略全解析

缓存是系统设计中最重要的优化手段之一。本文将深入探讨各种缓存策略及其适用场景。

## 为什么需要缓存？

在高并发系统中，数据库往往成为性能瓶颈。一个典型的 Web 请求可能需要执行多次数据库查询，而每次查询都会带来网络延迟和计算开销。

> 缓存的本质是用空间换时间——用更快的存储介质来减少对慢速存储的访问次数。

## 主要缓存策略

### Cache-Aside（旁路缓存）

这是最常见的缓存策略，也叫 Lazy Loading：

```python
def get_user(user_id: str) -> dict:
    # 1. 先查缓存
    cached = redis.get(f"user:{user_id}")
    if cached:
        return json.loads(cached)
    
    # 2. 缓存未命中，查数据库
    user = db.query("SELECT * FROM users WHERE id = ?", user_id)
    
    # 3. 写入缓存，设置过期时间
    redis.setex(f"user:{user_id}", 3600, json.dumps(user))
    return user
```

**优点：** 只缓存实际被读取的数据，不会浪费内存
**缺点：** 第一次请求总是缓存未命中（冷启动问题）

### Write-Through（直写）

每次写数据时，同步更新缓存和数据库：

```python
def update_user(user_id: str, data: dict) -> None:
    # 同时更新数据库和缓存
    db.execute("UPDATE users SET ... WHERE id = ?", user_id)
    redis.setex(f"user:{user_id}", 3600, json.dumps(data))
```

**优点：** 缓存数据始终与数据库一致
**缺点：** 写操作延迟增加，可能缓存大量不被读取的数据

### Write-Behind（异步写）

先写缓存，异步批量写入数据库：

| 策略 | 读性能 | 写性能 | 一致性 | 适用场景 |
|------|--------|--------|--------|----------|
| Cache-Aside | 高 | 中 | 最终 | 读多写少 |
| Write-Through | 高 | 低 | 强 | 金融交易 |
| Write-Behind | 高 | 高 | 弱 | 社交计数器 |

## 缓存失效问题

### 缓存穿透

请求的 key 在缓存和数据库中都不存在，导致每次都打到数据库。

**解决方案：** 缓存空值（null）或使用 Bloom Filter。

```python
# 使用布隆过滤器预检
if not bloom_filter.might_contain(user_id):
    return None  # 确定不存在，直接返回

# 继续正常的 Cache-Aside 逻辑
```

### 缓存雪崩

大量缓存同时失效，流量涌向数据库。

**解决方案：** 设置随机过期时间，避免同时失效：

```python
import random

# 基础过期时间 + 随机抖动
ttl = 3600 + random.randint(-300, 300)
redis.setex(key, ttl, value)
```

### 缓存击穿

某个热点 key 突然失效，大量并发请求同时打到数据库。

**解决方案：** 使用分布式锁（Mutex）：

```python
import redis

def get_hot_data(key: str) -> dict:
    cached = redis.get(key)
    if cached:
        return json.loads(cached)
    
    # 获取互斥锁
    lock_key = f"lock:{key}"
    if redis.set(lock_key, 1, nx=True, ex=10):
        try:
            # 只有获得锁的请求才查数据库
            data = db.query(key)
            redis.setex(key, 3600, json.dumps(data))
            return data
        finally:
            redis.delete(lock_key)
    else:
        # 未获得锁，短暂等待后重试
        time.sleep(0.05)
        return get_hot_data(key)
```

## 本地缓存 vs 分布式缓存

在微服务架构中，我们通常需要两层缓存：

1. **本地缓存（L1）**：进程内缓存，速度最快（纳秒级），但节点间不共享
2. **分布式缓存（L2）**：如 Redis，所有节点共享，毫秒级延迟

两级缓存策略能显著降低 Redis 的访问压力。

## 总结

选择缓存策略时，需要综合考虑：

- **一致性要求**：金融系统需要强一致性，推荐 Write-Through
- **读写比例**：读多写少场景，Cache-Aside 最合适
- **数据热度**：热点数据需要特别处理缓存击穿问题
- **内存限制**：设置合理的 TTL 和淘汰策略（LRU/LFU）

> 没有最好的缓存策略，只有最适合当前场景的策略。
