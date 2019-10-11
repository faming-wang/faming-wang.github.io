---
title: 查找算法
date: 2015-06-05
image: /images/blog/2.jpg
subtitle: 算法
description: 这里有常见的查找算法。线性查找、二分查找... 
categories: [algorithm]
---

## 查找算法

#### 一、线性查找

线性查找又称顺序查找，是一种最简单的查找方法（Linear search）

##### 基本思路：

从头开始，依次将每一个元素与查找目标做比较； 直到查找成功，或者失败。

##### C++示例

~~~ cpp
#include <iostream>

template <class Container, class CType>
int linear_search (const Container& data, int size, const CType& key)
{
    for (int i = 0; i < size; ++i)
        if (data[i] == key)
            return i;
    return -1;
}

int main(int argc, char** argv)
{
    {
        const auto key = int(7);
        const int data[] = { 3, 5, 3, 0, 8, 6, 1, 5, 8, 6, 2, 4, 9, 4, 7, 0, 1, 8, 9, 7, 3, 1, 2, 5, 9, 7, 4, 0, 2, 6 };
        const int length = int(sizeof(data) / sizeof(*data));
        const auto fined = linear_search(data, length, key);
        std::cout << fined << std::endl;
    }
    {
        const auto key = double(2.2);
        const double data[] = { 3.3, 5.5, 3.2, 0.2, 8.1, 6.1, 1.2, 5.4, 8.7, 6.3, 2.2, 4.4, 9.7, 9.5, 7.7, 4.3, 0.1, 2.8, 6.6 };
        const int length = int(sizeof(data) / sizeof(*data));
        const auto fined = linear_search(data, length, key);
        std::cout << fined << std::endl;
    }
    system("pause");
}
~~~

#### 二、二分查找
二分查找也称折半查找（Binary Search）；优点是比较次数少，查找速度快，平均性能好; 缺点是要求待查数据为有序

##### 基本思路：
1. 假设表中的元素按升序排列；
2. 若中间元素与查找目标相等，则查找成功，否则利用中间元素将表划分为前后两个子表；
3. 若查找目标小于中间元素，则在前子表中查找，否则在后子表中查找；
4. 重复以上过程，直到查找成功，或者失败。

##### C++示例

~~~ cpp
#include <iostream>

template <class Container, class CType>
int binary_search (const Container& data, int size, const CType& key)
{
    int left = 0;
    int right = size - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (key < data[mid])
            right = mid - 1;
        else if (data[mid] < key)
            left = mid + 1;
        else
            return mid;
    }
    return -1;
}

int main(int argc, char** argv)
{
    {
        const auto key = int(12);
        // 数据必须有序
        const int data[] = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 };
        const int length = int(sizeof(data) / sizeof(*data));
        const auto fined = binary_search(data, length, key);
        std::cout << fined << std::endl;
    }
    {
        const auto key = double(7.2);
        // 数据必须有序
        const double data[] = { 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 4.1, 4.2, 5.1, 5.2, 6.1, 6.2, 7.1, 7.2, 8.1, 8.2 };
        const int length = int(sizeof(data) / sizeof(*data));
        const auto fined = binary_search(data, length, key);
        std::cout << fined << std::endl;
    }
    system("pause");
}
~~~

