"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDynamic = exports.uploadGeneral = exports.uploadNews = exports.uploadCompany = exports.uploadProfile = exports.uploadProduct = exports.uploadBanner = exports.uploadImage = exports.handleUpload = exports.generalUpload = exports.newsUpload = exports.companyUpload = exports.profileUpload = exports.productUpload = exports.bannerUpload = exports.upload = exports.createUpload = exports.UPLOAD_TYPES = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// 确保上传目录存在
const ensureUploadDir = (dirPath) => {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
};
// 支持的上传类型和对应的文件夹
exports.UPLOAD_TYPES = {
    BANNER: 'banners',
    PRODUCT: 'products',
    PROFILE: 'profiles',
    COMPANY: 'company',
    NEWS: 'news',
    GENERAL: 'general'
};
// 生成唯一的文件名
const generateUniqueFileName = (originalName) => {
    const ext = path_1.default.extname(originalName);
    const name = path_1.default.basename(originalName, ext);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${name}_${timestamp}_${random}${ext}`;
};
// 动态存储配置工厂
const createStorage = (uploadType = exports.UPLOAD_TYPES.GENERAL) => {
    return multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const uploadDir = path_1.default.join(__dirname, '../../uploads', uploadType);
            ensureUploadDir(uploadDir);
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            // 优先使用自定义文件名，否则生成唯一文件名
            const customName = req.body.newName;
            const fileName = customName ?
                (customName.includes('.') ? customName : `${customName}${path_1.default.extname(file.originalname)}`) :
                generateUniqueFileName(file.originalname);
            cb(null, fileName);
        }
    });
};
// 文件过滤：只允许图片
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('只允许上传图片文件'), false);
    }
};
// 通用上传中间件创建器
const createUpload = (uploadType = exports.UPLOAD_TYPES.GENERAL) => {
    return (0, multer_1.default)({
        storage: createStorage(uploadType),
        fileFilter: fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB 限制
        }
    });
};
exports.createUpload = createUpload;
// 保持向后兼容的默认上传实例（banners）
exports.upload = (0, exports.createUpload)(exports.UPLOAD_TYPES.BANNER);
// 各种类型的上传实例
exports.bannerUpload = (0, exports.createUpload)(exports.UPLOAD_TYPES.BANNER);
exports.productUpload = (0, exports.createUpload)(exports.UPLOAD_TYPES.PRODUCT);
exports.profileUpload = (0, exports.createUpload)(exports.UPLOAD_TYPES.PROFILE);
exports.companyUpload = (0, exports.createUpload)(exports.UPLOAD_TYPES.COMPANY);
exports.newsUpload = (0, exports.createUpload)(exports.UPLOAD_TYPES.NEWS);
exports.generalUpload = (0, exports.createUpload)(exports.UPLOAD_TYPES.GENERAL);
// 通用上传处理函数
const handleUpload = async (req, res, uploadType) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '没有上传文件'
            });
        }
        const fileName = req.file.filename;
        const filePath = `/uploads/${uploadType}/${fileName}`;
        res.json({
            success: true,
            message: '上传成功',
            data: {
                fileName: fileName,
                filePath: filePath,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                uploadType: uploadType
            }
        });
    }
    catch (error) {
        console.error(`Upload error (${uploadType}):`, error);
        res.status(500).json({
            success: false,
            message: '上传失败',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.handleUpload = handleUpload;
// 通用上传处理
const uploadImage = async (req, res) => {
    await (0, exports.handleUpload)(req, res, exports.UPLOAD_TYPES.BANNER);
};
exports.uploadImage = uploadImage;
// 轮播图上传
const uploadBanner = async (req, res) => {
    await (0, exports.handleUpload)(req, res, exports.UPLOAD_TYPES.BANNER);
};
exports.uploadBanner = uploadBanner;
// 产品图片上传
const uploadProduct = async (req, res) => {
    await (0, exports.handleUpload)(req, res, exports.UPLOAD_TYPES.PRODUCT);
};
exports.uploadProduct = uploadProduct;
// 个人资料图片上传
const uploadProfile = async (req, res) => {
    await (0, exports.handleUpload)(req, res, exports.UPLOAD_TYPES.PROFILE);
};
exports.uploadProfile = uploadProfile;
// 公司相关图片上传
const uploadCompany = async (req, res) => {
    await (0, exports.handleUpload)(req, res, exports.UPLOAD_TYPES.COMPANY);
};
exports.uploadCompany = uploadCompany;
// 新闻图片上传
const uploadNews = async (req, res) => {
    await (0, exports.handleUpload)(req, res, exports.UPLOAD_TYPES.NEWS);
};
exports.uploadNews = uploadNews;
// 通用图片上传
const uploadGeneral = async (req, res) => {
    await (0, exports.handleUpload)(req, res, exports.UPLOAD_TYPES.GENERAL);
};
exports.uploadGeneral = uploadGeneral;
// 动态上传类型处理器（通过请求参数指定上传类型）
const uploadDynamic = async (req, res) => {
    const uploadType = req.body.type || exports.UPLOAD_TYPES.GENERAL;
    if (!Object.values(exports.UPLOAD_TYPES).includes(uploadType)) {
        return res.status(400).json({
            success: false,
            message: `不支持的上传类型: ${uploadType}，支持的类型: ${Object.values(exports.UPLOAD_TYPES).join(', ')}`
        });
    }
    await (0, exports.handleUpload)(req, res, uploadType);
};
exports.uploadDynamic = uploadDynamic;
