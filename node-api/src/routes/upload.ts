import { Router } from 'express';
import { 
  upload, 
  uploadImage, 
  bannerUpload, 
  uploadBanner, 
  productUpload, 
  uploadProduct, 
  profileUpload, 
  uploadProfile, 
  companyUpload, 
  uploadCompany, 
  newsUpload, 
  uploadNews, 
  generalUpload, 
  uploadGeneral,
  createUpload,
  uploadDynamic,
  UPLOAD_TYPES
} from '../controllers/upload';

const router = Router();

// 默认上传接口（保持向后兼容，等同于轮播图上传）
router.post('/', upload.single('file'), uploadImage);

// 轮播图上传
router.post('/banner', bannerUpload.single('file'), uploadBanner);

// 产品图片上传
router.post('/product', productUpload.single('file'), uploadProduct);

// 个人资料图片上传
router.post('/profile', profileUpload.single('file'), uploadProfile);

// 公司相关图片上传
router.post('/company', companyUpload.single('file'), uploadCompany);

// 新闻图片上传
router.post('/news', newsUpload.single('file'), uploadNews);

// 通用图片上传
router.post('/general', generalUpload.single('file'), uploadGeneral);

// 动态类型上传（通过请求参数 type 指定上传类型）
router.post('/dynamic', createUpload().single('file'), uploadDynamic);

// 获取支持的上传类型信息
router.get('/types', (req, res) => {
  res.json({
    success: true,
    data: {
      types: UPLOAD_TYPES,
      description: {
        banners: '轮播图',
        products: '产品图片',
        profiles: '个人资料图片',
        company: '公司相关图片',
        news: '新闻图片',
        general: '通用图片'
      }
    }
  });
});

export default router;
