# Ownnet DDNS NSServer
## 简介
## 安装
### Node.js安装
建议前往[Node.js](https://nodejs.org)网站寻找安装教程  
Debian8安装可参考[这篇博客](http://o00o.site/archives/69)的"0x03 使用二进制包"部分安装
### 下载源码
git clone或http方式下载并解压本仓库
### 程序安装
1. `npm install`
2. 将main.bak.db重命名为main.db 
 
### 修改配置  
配置文件位于config.js中，请按需修改数据库位置，监听的ip及端口以及DNS ZONE信息

### 运行
两种方法：  
1. 在程序根目录以root用户执行npm start  
2. 在程序根目录以root用户执行node server.js  
*注：NS服务默认监听端口号为53，小于1024，必须以root用户执行*

可在screen中运行或使用nohup运行；在windows下运行时请保持命令行窗口开启

### 测试
`dig @localhost your.domain.com A`

### 使用方法
见ownnet/ddns仓库中文档：01