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
  PRODUCT: 'product', 
  COMPANY: 'company',
  NEWS: 'news',
  HONOR: 'honor',
  CULTURE: 'culture'
} as const;

export type UploadType = typeof UPLOAD_TYPES[keyof typeof UPLOAD_TYPES];

// 生成唯一的文件名
const generateUniqueFileName = (originalName: string): string => {
  // 修复：应该是 extname 而不是 xextname
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${name}_${timestamp}_${random}${ext}`;
};

// 动态存储配置工厂
const createStorage = (uploadType: UploadType) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../../../uploads', uploadType);
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
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件'));
  }
};

// 通用上传中间件创建器
export const createUpload = (uploadType: UploadType) => {
  return multer({
    storage: createStorage(uploadType),
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB 限制
    }
  });
};

// 各种类型的上传中间件实例
export const bannerUpload = createUpload(UPLOAD_TYPES.BANNER);
export const productUpload = createUpload(UPLOAD_TYPES.PRODUCT);
export const companyUpload = createUpload(UPLOAD_TYPES.COMPANY);
export const newsUpload = createUpload(UPLOAD_TYPES.NEWS);
export const cultureUpload = createUpload(UPLOAD_TYPES.CULTURE);
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

// 轮播图上传
export const uploadBanner = async (req: Request, res: Response) => {
  await handleUpload(req, res, UPLOAD_TYPES.BANNER);
};

// 产品图片上传
export const uploadProduct = async (req: Request, res: Response) => {
  await handleUpload(req, res, UPLOAD_TYPES.PRODUCT);
};

// 荣誉资质图上传
export const uploadHonor = async (req: Request, res: Response) => {
  await handleUpload(req, res, UPLOAD_TYPES.HONOR);
};

// 企业文化图上传
export const uploadCulture = async (req: Request, res: Response) => {
  await handleUpload(req, res, UPLOAD_TYPES.CULTURE);
};

// 公司相关图片上传
export const uploadCompany = async (req: Request, res: Response) => {
  await handleUpload(req, res, UPLOAD_TYPES.COMPANY);
};

// 新闻图片上传
export const uploadNews = async (req: Request, res: Response) => {
  await handleUpload(req, res, UPLOAD_TYPES.NEWS);
};

// 动态上传类型处理器（通过请求参数指定上传类型）
export const uploadDynamic = async (req: Request, res: Response) => {
  const uploadType = req.body.type as UploadType;
  
  if (!uploadType || !Object.values(UPLOAD_TYPES).includes(uploadType)) {
    return res.status(400).json({
      success: false,
      message: `不支持的上传类型: ${uploadType}，支持的类型: ${Object.values(UPLOAD_TYPES).join(', ')}`
    });
  }
  
  await handleUpload(req, res, uploadType);
};

// 获取指定类型的图片列表
export const getImagesByType = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    
    if (!type || !Object.values(UPLOAD_TYPES).includes(type as UploadType)) {
      return res.status(400).json({
        success: false,
        message: `不支持的图片类型: ${type}，支持的类型: ${Object.values(UPLOAD_TYPES).join(', ')}`
      });
    }

    const uploadType = type as UploadType;
    const uploadDir = path.join(__dirname, '../../../../uploads', uploadType);

    if (!fs.existsSync(uploadDir)) {
      return res.json({
        success: true,
        data: {
          type: uploadType,
          count: 0,
          images: []
        }
      });
    }

    const files = fs.readdirSync(uploadDir);
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
      })
      .map(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          url: `/uploads/${uploadType}/${file}`,
          size: stats.size,
          createTime: stats.birthtime,
          modifyTime: stats.mtime
        };
      })
      .sort((a, b) => b.modifyTime.getTime() - a.modifyTime.getTime()); // 按修改时间倒序

    res.json({
      success: true,
      data: {
        type: uploadType,
        count: images.length,
        images
      }
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({
      success: false,
      message: '获取图片列表失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// 删除指定图片
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { type, filename } = req.params;
    
    if (!type || !Object.values(UPLOAD_TYPES).includes(type as UploadType)) {
      return res.status(400).json({
        success: false,
        message: `不支持的图片类型: ${type}`
      });
    }

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: '未指定文件名'
      });
    }

    const uploadDir = path.join(__dirname, '../../../uploads', type);
    const filePath = path.join(uploadDir, filename);

    // 安全检查：确保文件路径在 uploads 目录内
    const relativePath = path.relative(path.join(__dirname, '../../../uploads'), filePath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      return res.status(403).json({
        success: false,
        message: '非法的文件路径'
      });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: '删除成功',
      data: {
        type,
        filename
      }
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: '删除失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};