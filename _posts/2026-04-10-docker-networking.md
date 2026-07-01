---
layout: post
title: "Docker 网络模式详解"
date: 2026-04-10
read_time: "9 分钟"
tags: [Docker, 工程实践, DevOps]
cover: cover-gray
cover_text: "🐳"
featured: false
excerpt: "Bridge、Host、Overlay——Docker 的网络模式让很多人头疼。本文用图解的方式带你彻底搞清楚容器网络的工作机制。"
---

# Docker 网络模式详解

Docker 的网络是很多开发者的盲区。搞清楚它，对调试容器问题至关重要。

## Bridge 模式（默认）

默认情况下，Docker 创建一个名为 `docker0` 的虚拟网桥：

```bash
# 查看 docker0 网桥
ip addr show docker0
# docker0: <BROADCAST,MULTICAST,UP,LOWER_UP>
# inet 172.17.0.1/16

# 查看容器 IP
docker inspect my_container | grep IPAddress
# "IPAddress": "172.17.0.3"
```

容器通过 `veth` 对连接到 `docker0`，容器间可以直接通信，但外部访问需要端口映射（`-p`）。

## Host 模式

```bash
docker run --network host nginx
# 直接使用宿主机的网络栈，没有 NAT 开销
# 适合对网络性能要求极高的场景
```

**缺点：** 容器端口直接暴露，有安全风险；不支持端口映射。

## 自定义 Bridge 网络（推荐）

```bash
# 创建自定义网络
docker network create my-net

# 同一网络内可以用容器名直接访问
docker run -d --name db --network my-net postgres
docker run -d --name app --network my-net my-app
# app 容器中可以直接 ping db 或 connect to db:5432
```

**自定义 bridge 的优势：**
- 自动 DNS 解析（可用容器名）
- 更好的隔离性
- 可动态连接/断开

## docker-compose 网络

```yaml
version: '3.8'
services:
  web:
    image: nginx
    ports:
      - "80:80"
    networks:
      - frontend
  
  api:
    build: .
    networks:
      - frontend
      - backend
  
  db:
    image: postgres
    networks:
      - backend  # 只有 api 能访问 db

networks:
  frontend:
  backend:
```

通过网络分层实现服务隔离，是容器化最佳实践。

## 调试技巧

```bash
# 查看所有网络
docker network ls

# 检查网络详情（包含容器列表）
docker network inspect my-net

# 进入容器排查网络问题
docker exec -it my_container sh
# 然后: ping, curl, netstat -an
```

理解 Docker 网络，才能真正驾驭容器化部署。
