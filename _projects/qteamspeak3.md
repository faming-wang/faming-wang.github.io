---
title: QTeamSpeak3
date: 2019-10-01
image: /images/work/3.jpg
description: 使用 Qt 封装的 TeamSpeak3 SDK 
categories: [C++,Qt]
---

## QTeamSpeak3 
使用 Qt 封装的 TeamSpeak3 SDK. 它以Qt风格提供了相同的功能。
你可能需要了解TeamSpeak3的帮助文档。

#### 主要特点:
* 跨平台 (Windows, Linux, MacOS, Android, iOS)
* 以面向对象设计的API

#### Class 说明
* TeamSpeakSdk::Library - 本地 Library 封装
* TeamSpeakSdk::Connection - SDK服务器 连接器
* TeamSpeakSdk::Client - SDK服务器 客户端 
* TeamSpeakSdk::Channel -  SDK服务器 频道
* TeamSpeakSdk::FileTransfer - SDK服务器 文件传输
* TeamSpeakSdk::WaveHandler - wave文件本地播放

#### 依赖
* 编译器需要支持C++11
* [TeamSpeak 3 SDK](http://TeamSpeak.com/downloads#sdk) >= 3.0.0
* [Qt](https://qt.io/download/) >= 5.6.0
* [Cmake](https://cmake.org/download/) >= 3.9.0

#### Cmake 编译
~~~
git clone https://github.com/faming-wang/QTeamSpeak3.git ./QTeamSpeak3
cd QTeamSpeak3
~~~
创建一个构建目录
~~~
mkdir out
~~~
在构建目录中运行 cmake 命令来配置
~~~
cd out
cmake .. -D Qt5_DIR=[you qt lib root path]/lib/cmake/Qt5
~~~
On Window
~~~
msbuild QTeamSpeak3.sln /property:Configuration=Debug /property:Platform="Win32"
msbuild QTeamSpeak3.sln /property:Configuration=Release /property:Platform="Win32"
~~~
On Linux or MacOS
~~~
make
make install
~~~

[项目链接](https://github.com/faming-wang/QTeamSpeak3)
