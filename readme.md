项目运行说明
1. 数据库配置
将 web.sql 文件导入到 MySQL 数据库中。

确保 MySQL 数据库服务已开启。

在 node-api/config/db.js 文件中修改数据库登录信息。

2. 后端启动
进入 node-api/dist 目录，执行以下命令：

bash
node .\app.js
3. 前端启动
进入 vue-project/dist 目录，执行以下命令：

bash
serve -s . -p 8080
注：-p 参数后的端口可自定义，若修改端口，需在 node-api/app.js 中对应添加允许的端口。