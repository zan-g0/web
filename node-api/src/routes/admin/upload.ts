import { Router } from 'express';
import {
  bannerUpload,
  productUpload,
  companyUpload,
  newsUpload,
  cultureUpload,
  honorUpload,
  uploadBanner,
  uploadProduct,
  uploadCompany,
  uploadNews,
  uploadCulture,
  uploadHonor,
  uploadDynamic,
  getImagesByType,
  deleteImage
} from '../../controllers/admin/upload';

const router = Router();

// 轮播图上传
router.post('/banner', bannerUpload.single('image'), uploadBanner);

// 产品图片上传
router.post('/product', productUpload.single('image'), uploadProduct);

// 公司图片上传
router.post('/company', companyUpload.single('image'), uploadCompany);

// 新闻图片上传
router.post('/news', newsUpload.single('image'), uploadNews);

// 企业文化图片上传
router.post('/culture', cultureUpload.single('image'), uploadCulture);

// 荣誉资质图片上传
router.post('/honor', honorUpload.single('image'), uploadHonor);

// 动态类型上传（通过请求体指定类型）
router.post('/dynamic', (req, res, next) => {
  const type = req.body.type;
  let uploadMiddleware;

  switch (type) {
    case 'banners':
      uploadMiddleware = bannerUpload;
      break;
    case 'product':
      uploadMiddleware = productUpload;
      break;
    case 'company':
      uploadMiddleware = companyUpload;
      break;
    case 'news':
      uploadMiddleware = newsUpload;
      break;
    case 'culture':
      uploadMiddleware = cultureUpload;
      break;
    case 'honor':
      uploadMiddleware = honorUpload;
      break;
    default:
      return res.status(400).json({
        success: false,
        message: `不支持的上传类型: ${type}`
      });
  }

  uploadMiddleware.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
}, uploadDynamic);

// 获取指定类型的图片列表
router.get('/list/:type', getImagesByType);

// 删除指定图片
router.delete('/:type/:filename', deleteImage);

// 多文件上传示例
router.post('/:type/multiple', (req, res, next) => {
  const { type } = req.params;
  let uploadMiddleware;

  switch (type) {
    case 'banners':
      uploadMiddleware = bannerUpload;
      break;
    case 'product':
      uploadMiddleware = productUpload;
      break;
    case 'company':
      uploadMiddleware = companyUpload;
      break;
    case 'news':
      uploadMiddleware = newsUpload;
      break;
    case 'culture':
      uploadMiddleware = cultureUpload;
      break;
    case 'honor':
      uploadMiddleware = honorUpload;
      break;
    default:
      return res.status(400).json({
        success: false,
        message: `不支持的上传类型: ${type}`
      });
  }

  uploadMiddleware.array('images', 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有上传文件'
      });
    }

    const { type } = req.params;
    const fileInfos = files.map(file => ({
      fileName: file.filename,
      filePath: `/uploads/${type}/${file.filename}`,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      success: true,
      message: `成功上传 ${files.length} 个文件`,
      data: {
        count: files.length,
        files: fileInfos
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '上传失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;