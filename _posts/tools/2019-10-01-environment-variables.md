---
title: 环境变量
date: 2019-10-01
image: /images/blog/3.jpg
subtitle: 工具
description: 各种开发平台环境变量设置总结... 
categories: [tools]
---

### MacOS平台环境变量设置
#### 1. 系统级别
/etc/profile  
/etc/bashrc  
/etc/paths  

这些配置不建议修改  
推荐在目录/etc/paths.d/ 添加文件，文件内容写上你想添加的环境变量  
~~~
例如：  
sudo echo "/Library/Frameworks/Python.framework/Versions/3.7/bin" >> /etc/paths.d/python.3
~~~

#### 2. 用户级别的
可能由于使用的shell不同导致加载的环境变量不同
1. bash shell
~~~
~/.bash_profile
~~~
2. zsh（自macOS Catalina 10.15开始，系统建议用户使用zsh）
~~~
~/.zshrc
~~~
