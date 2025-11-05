import express from 'express';
import cors from 'cors';
import router from './routes/index';
import path from 'path';
const app = express();
  
// 中间件
app.use(cors({
  origin: [
    "http://localhost:5173", // 前端
    "http://localhost:8848", // 后台管理
    "http://localhost:3000", // 后端端口
    // 可以添加其他需要允许的域名
  ],
  credentials: true, // 如果需要传递 cookie 等凭证
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 其他中间件
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// 路由
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});