# 项目介绍

node-api为后端

pure-admin-thin为后台管理

vue-project为前端展示

# 📦 项目运行说明(生产环境)

## 1. 基本配置

开发环境使用NPM脚本install安装依赖

dev启动开发服务器

build打包

start或preview打包后预览

将 web.sql 文件导入到 MySQL 数据库中

确保 MySQL 数据库服务已开启

在 node-api/config/db.js 文件中修改数据库登录信息

## 2. 后端启动

### 2.1 简单启动(临时预览)

```bash
cd ./node-api/dist
node app.js
```

### 2.2 使用 PM2（最推荐）

PM2 是 Node.js 生产环境进程管理器，功能强大：

```bash
# 安装 PM2
npm install -g pm2

# 验证安装
pm2 --version

# 启动应用
pm2 start app.js --name "my-api"

# 常用命令
pm2 list                    # 查看所有进程
pm2 logs                    # 查看日志
pm2 monit                   # 监控资源
pm2 restart my-api          # 重启
pm2 stop my-api             # 停止
pm2 delete my-api           # 删除
which pm2                   # 查看 PM2 的位置
# 开机自启
pm2 startup                 # 生成开机自启脚本
pm2 save                    # 保存当前进程列表

# 集群模式（利用多核 CPU）
pm2 start app.js -i max --name "my-api"
```

## 3. 前端启动

### 3.1 简单启动（临时预览）

```bash
cd ./vue-project/dist
npx -s . -p 8080
```

注：-p 参数后的端口可自定义，若修改端口，需在 node-api/app.js 中对应添加允许的端口。

使用Nginx（最推荐，生产环境标准）

### 3.2 Linux 上部署前端页面（Nginx）

## 1. 启动 Nginx

‌使用默认配置启动‌：

```bash
nginx
```

或者指定配置文件启动：

```bash
nginx -c /path/to/nginx.conf
```

### 2. 停止 Nginx

‌优雅停止（推荐）‌：

```bash
nginx -s quit
```

等待当前请求处理完毕后停止。

‌快速停止‌：

```bash
nginx -s stop
```

立即停止服务。

‌强制停止‌：

```bash
pkill -9 nginx
```

或者通过进程号杀死进程：

```bash
kill -9 <进程号>
```

### 3. 重启 Nginx

‌重新加载配置文件（推荐）‌：

```bash
nginx -s reload
```

无需完全停止服务，重新加载配置。

‌先停止再启动‌：

```bash
nginx -s stop
```

### 4. 其他常用命令

‌测试配置文件‌：

```bash
nginx -t
```

或指定配置文件：

```bash
nginx -t -c /path/to/nginx.conf
```

‌查看 Nginx 版本‌：

```bash
nginx -v
```

‌重新打开日志文件‌：

```bash
nginx -s reopen
```

### 5. 使用 systemctl 管理（适用于基于 systemd 的系统）

‌启动‌：

```bash
sudo systemctl start nginx
```

‌停止‌：

```bash
sudo systemctl stop nginx
或
sudo pkill -9 nginx
```

‌重启‌：

```bash
sudo systemctl restart nginx
```

‌重新加载配置‌：

```bash
sudo systemctl reload nginx
```

‌查看状态‌：

```bash
sudo systemctl status nginx
或
ps -ef | grep nginx
```

### 6. 查看进程

查看 Nginx 进程：

```bash
ps -ef | grep nginx
```
