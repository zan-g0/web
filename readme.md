# 📦 项目运行说明(生产环境)

## 1. 数据库配置

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

### 3.2 Windows 上部署前端页面（Nginx）
#### 3.2.1 下载和安装 Nginx for Windows
下载 Nginx

访问 http://nginx.org/en/download.html

下载 Windows 版本（例如 nginx-1.26.2.zip）

 解压安装

```bash
# 解压到合适的位置，例如：
C:\nginx
# 或
D:\nginx
```
 目录结构

```text
C:\nginx\
├── conf\           # 配置文件目录
│   └── nginx.conf   # 主配置文件
├── html\           # 默认网站目录
├── logs\           # 日志目录
└── nginx.exe       # 主程序
```
#### 3.2.2 放置前端文件
```bash
# 创建网站目录
C:\www\my-website\
# 或
D:\www\my-website\

# 将你的 dist 文件复制到这里
C:\www\my-website\index.html
C:\www\my-website\assets\
C:\www\my-website\css\
C:\www\my-website\js\
```
#### 3.2.3 配置 Nginx
编辑 C:\nginx\conf\nginx.conf：

```nginx
# nginx.conf
worker_processes  1;  # Windows 通常用 1

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    # 日志格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    # 访问日志
    access_log  logs/access.log  main;
    error_log   logs/error.log;

    sendfile        on;
    keepalive_timeout  65;

    # 你的前端网站配置
    server {
        listen       8080;  # Windows 上避免使用 80 端口（可能被占用）
        server_name  localhost;

        # 字符集设置（解决中文乱码）
        charset utf-8;

        # 网站根目录（指向你的 dist 文件夹）
        root C:/www/my-website;  # 使用正斜杠
        index index.html;

        # Gzip 压缩
        gzip on;
        gzip_min_length 1k;
        gzip_comp_level 6;
        gzip_types text/plain text/css text/javascript application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss;
        gzip_vary on;
        gzip_disable "MSIE [1-6]\.";

        # 静态资源缓存
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
            access_log off;
        }

        # SPA 路由支持（关键配置）
        location / {
            try_files $uri $uri/ /index.html;
        }

        # 代理 API 请求到后端（如果需要）
        location /api/ {
            proxy_pass http://localhost:3000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 错误页面
        error_page 404 /index.html;  # 对于 SPA，404 也返回 index.html
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root C:/nginx/html;
        }
    }

    # 可以配置多个网站
    # server {
    #     listen       8081;
    #     server_name  localhost2;
    #     root D:/www/another-site;
    #     index index.html;
    #     location / {
    #         try_files $uri $uri/ /index.html;
    #     }
    # }
}
```
#### 3.2.4 启动和管理 Nginx
方法1：命令行管理
```bash
# 进入 Nginx 目录
cd C:\nginx

# 启动 Nginx
start nginx
# 或
nginx.exe

# 检查配置是否正确
nginx -t

# 重新加载配置（修改配置后使用）
nginx -s reload

# 停止 Nginx
nginx -s stop    # 快速停止
# 或
nginx -s quit    # 优雅停止（完成当前请求）

# 重启 Nginx
nginx -s reopen
```