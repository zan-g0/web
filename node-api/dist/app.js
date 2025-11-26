"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// 中间件
app.use((0, cors_1.default)({
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
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static("uploads"));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// 路由
app.use('/api', index_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
