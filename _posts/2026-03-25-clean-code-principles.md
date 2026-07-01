---
layout: post
title: "写出可读代码的 10 个原则"
date: 2026-03-25
read_time: "8 分钟"
tags: [工程实践, 代码质量]
cover: cover-pink
cover_text: Code
featured: false
excerpt: "好的代码不只是能运行的代码，它应该让其他人（包括未来的你）能轻松理解。分享我在工程实践中总结的 10 条写出可读代码的核心原则。"
---

# 写出可读代码的 10 个原则

代码被阅读的次数远多于被编写的次数。因此，可读性是代码质量最重要的维度之一。

## 1. 命名即文档

```python
# 差
def calc(u, d, r):
    return u * d * (1 - r)

# 好
def calculate_discounted_price(unit_price, quantity, discount_rate):
    return unit_price * quantity * (1 - discount_rate)
```

好的命名让代码自我解释，减少注释的需要。

## 2. 函数只做一件事

**单一职责原则（SRP）** 是最重要的原则之一。一个函数超过 20 行就该考虑拆分了。

## 3. 避免否定条件

```python
# 难读
if not is_not_authenticated(user):
    ...

# 清晰
if is_authenticated(user):
    ...
```

## 4. 用卫语句减少嵌套

```typescript
// 深度嵌套
function processOrder(order: Order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.isPaid) {
        // 实际逻辑在第三层
      }
    }
  }
}

// 卫语句（早返回）
function processOrder(order: Order) {
  if (!order) return;
  if (order.items.length === 0) return;
  if (!order.isPaid) return;
  
  // 实际逻辑在第一层
}
```

## 5. 魔法数字要有名字

```cpp
// 差：86400 是什么？
if (elapsed > 86400) { expire(); }

// 好
constexpr int SECONDS_PER_DAY = 86400;
if (elapsed > SECONDS_PER_DAY) { expire(); }
```

## 6. 注释解释"为什么"，不解释"是什么"

代码本身说明"是什么"，注释应该解释"为什么这样做"：

```python
# 差注释：这行代码将 x 乘以 2
x = x * 2

# 好注释：补偿传感器的已知校准偏差（见 issue #123）
reading = raw_value * 2
```

## 7. 保持一致的抽象层级

一个函数要么处理高层逻辑，要么处理低层细节，不要混合。

## 8. 优先使用不可变数据

减少可变状态，减少 bug。Python 用 tuple，JS 用 const，Rust 默认不可变——这些语言设计都在引导你这样做。

## 9. 测试就是文档

好的测试用例让读者理解函数的期望行为：

```python
def test_calculate_discounted_price():
    assert calculate_discounted_price(100, 2, 0.1) == 180  # 9折
    assert calculate_discounted_price(50, 1, 0.0) == 50    # 无折扣
    assert calculate_discounted_price(0, 10, 0.5) == 0     # 零价格
```

## 10. 删除死代码

注释掉的代码会让人困惑（为什么注释掉？以后会用吗？）。有 git，不需要"以备不时之需"的注释代码。

> 代码是写给人读的，顺便让机器执行。——Harold Abelson
