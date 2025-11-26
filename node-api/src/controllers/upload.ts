import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 确保上传目录存在
const ensureUploadDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// 支持的上传类型和对应的文件夹
export const UPLOAD_TYPES = {
  BANNER: 'banners',
  PRODUCT: 'products', 
  PROFILE: 'profiles',
  COMPANY: 'company',
  NEWS: 'news',
  GENERAL: 'general',
  HONOR: 'honor'
} as const;

type UploadType = typeof UPLOAD_TYPES[keyof typeof UPLOAD_TYPES];

// 生成唯一的文件名
const generateUniqueFileName = (originalName: string): string => {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${name}_${timestamp}_${random}${ext}`;
};

// 动态存储配置工厂
const createStorage = (uploadType: UploadType = UPLOAD_TYPES.GENERAL) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../../uploads', uploadType);
      ensureUploadDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // 优先使用自定义文件名，否则生成唯一文件名
      const customName = req.body.newName as string;
      const fileName = customName ? 
        (customName.includes('.') ? customName : `${customName}${path.extname(file.originalname)}`) :
        generateUniqueFileName(file.originalname);
      cb(null, fileName);
    }
  });
};

// 文件过滤：只允许图片
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件'), false);
  }
};

// 通用上传中间件创建器
export const createUpload = (uploadType: UploadType = UPLOAD_TYPES.GENERAL) => {
  return multer({
    storage: createStorage(uploadType),
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB 限制
    }
  });
};

// 保持向后兼容的默认上传实例（banners）
export const upload = createUpload(UPLOAD_TYPES.BANNER);

// 各种类型的上传实例
export const bannerUpload = createUpload(UPLOAD_TYPES.BANNER);
export const productUpload = createUpload(UPLOAD_TYPES.PRODUCT);
export const profileUpload = createUpload(UPLOAD_TYPES.PROFILE);
export const companyUpload = createUpload(UPLOAD_TYPES.COMPANY);
export const newsUpload = createUpload(UPLOAD_TYPES.NEWS);
export const generalUpload = createUpload(UPLOAD_TYPES.GENERAL);
export const honorUpload = createUpload(UPLOAD_TYPES.HONOR);

// 通用上传处理函数
export const handleUpload = async (req: Request, res: Response, uploadType: UploadType) => {
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
  } catch (error) {
    console.error(`Upload error (${uploadType}):`, error);
    res.status(500).json({
      success: false,
      message: '上传失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 通用上传处理
export const uploadImage = async (req: Request, res: Response) => {
  await handleUpload(req, res, UPLOAD_TYPES.BANNER);
};

// 轮播图上传
export const uploadBanner = async (req: Request, res: Response) => {
  await handleUpload(req, res, UPLOAD_TYPES.BANNER);
};

// 产品图片上传
export const uploadProduct = async (req: Request, res: Response) => {
  await handleUpload(req, res, UPLOAD_TYPES.PRODUCT);
};

//荣誉资质图上传
export const uploadHonor = async (req: Request, res: Response) => {
  await handleUpload(req, res, UPLOAD_TYPES.HONOR);
};

// 个人资料图片上传
export const uploadProfile = async (req: Request, res: Response) => {
  await handleUpload(req, res, UPLOAD_TYPES.PROFILE);
};

// 公司相关图片上传
export const uploadCompany = async (req: Request, res: Response) => {
  await handleUpload(req, res, UPLOAD_TYPES.COMPANY);
};

// 新闻图片上传
export const uploadNews = async (req: Request, res: Response) => {
  await handleUpload(req, res, UPLOAD_TYPES.NEWS);
};

// 通用图片上传
export const uploadGeneral = async (req: Request, res: Response) => {
  await handleUpload(req, res, UPLOAD_TYPES.GENERAL);
};

// 动态上传类型处理器（通过请求参数指定上传类型）
export const uploadDynamic = async (req: Request, res: Response) => {
  const uploadType: UploadType = (req.body.type as UploadType) || UPLOAD_TYPES.GENERAL;
  
  if (!Object.values(UPLOAD_TYPES).includes(uploadType)) {
    return res.status(400).json({
      success: false,
      message: `不支持的上传类型: ${uploadType}，支持的类型: ${Object.values(UPLOAD_TYPES).join(', ')}`
    });
  }
  
  await handleUpload(req, res, uploadType);
};
