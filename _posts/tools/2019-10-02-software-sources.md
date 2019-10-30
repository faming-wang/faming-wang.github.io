---
title: 软件源
date: 2019-10-01
image: /images/blog/4.jpg
subtitle: 工具
description: 各种语言软件源总结... 
categories: [tools]
---

#### Ruby (gem)
[可以直接访问Ruby China](https://gems.ruby-china.com/)

#### Go
[可以直接访问goproxy](https://github.com/goproxy/goproxy.cn/blob/master/README.zh-CN.md)

#### NodeJS (npm)
[可以直接访问TAONPM](https://npm.taobao.org/)
~~~
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
~~~

#### macOS (Homebrew)
这里推荐使用中科院的国内镜像
~~~
cd "$(brew --repo)"
git remote set-url origin https://mirrors.ustc.edu.cn/brew.git 

// 替换核心软件仓库
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git 

// 替换 cask 软件仓库
cd "$(brew --repo)"/Library/Taps/caskroom/homebrew-cask
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-cask.git

// 替换 Bottles 源
// 添加环境变量
export HOMEBREW_BOTTLE_DOMAIN=[https://mirrors.ustc.edu.cn/homebrew-bottles](https://mirrors.ustc.edu.cn/homebrew-bottles rel=)
~~~

如何添加环境变量请参考我的[如何设置环境变量](/blog/tools/environment-variables)

检查是否成功
~~~
brew update
brew doctor
~~~

#### CentOS (yum)
[参考网易CentOS镜像使用帮助](http://mirrors.163.com/.help/centos.html)

#### Ubuntu (apt-get)
[参考网易Ubuntu镜像使用帮助](http://mirrors.163.com/.help/ubuntu.html)

#### 一些开源镜像网站
[阿里开源镜像](https://opsx.alibaba.com/mirror)

[网易开源镜像](http://mirrors.163.com/)

[腾讯开源镜像](https://mirrors.cloud.tencent.com/)

[清华大学开源软件镜像](https://mirrors.tuna.tsinghua.edu.cn/)

[北京理工大学开源软件镜像](http://mirror.bit.edu.cn/web/)
