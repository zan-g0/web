import express from 'express';
import cors from 'cors';
import router from './routes/index'; 
const app = express();

// 中间件
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

// 路由
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});