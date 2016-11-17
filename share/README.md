# 基于fis3构建的UI组件库

## window说明

先下载一个`tortoisegit` 将项目clone下来

# 安装依赖

```shell
npm install --registry=https://registry.npm.taobao.org
```

## 开发模式

## 本地起服务器开发

```shell
fis3 server start
```
## 停止本地服务器

```shell
fis3 server stop
```
## 本地编译，浏览器自动刷新

```shell
fis3 release -cwL
```
## 测试环境部署,自动默认静态文件部署到.5，html文件部署到179

```shell
fis3 release qa
```
## 上线编译,默认输出路径为当前路径的dist文件夹  

## 执行如下命令
```shell
npm run prod
```
或者执行如下两行命名

## windows命令删除本地dist文件夹
```shell
rd/s/q dist
```
## 编译打包到本地dist文件夹下边
```shell
fis3 release prod
```