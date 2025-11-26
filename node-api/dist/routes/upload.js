"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = require("../controllers/upload");
const router = (0, express_1.Router)();
// 默认上传接口（保持向后兼容，等同于轮播图上传）
router.post('/', upload_1.upload.single('file'), upload_1.uploadImage);
// 轮播图上传
router.post('/banner', upload_1.bannerUpload.single('file'), upload_1.uploadBanner);
// 产品图片上传
router.post('/product', upload_1.productUpload.single('file'), upload_1.uploadProduct);
// 个人资料图片上传
router.post('/profile', upload_1.profileUpload.single('file'), upload_1.uploadProfile);
// 公司相关图片上传
router.post('/company', upload_1.companyUpload.single('file'), upload_1.uploadCompany);
// 新闻图片上传
router.post('/news', upload_1.newsUpload.single('file'), upload_1.uploadNews);
// 通用图片上传
router.post('/general', upload_1.generalUpload.single('file'), upload_1.uploadGeneral);
// 动态类型上传（通过请求参数 type 指定上传类型）
router.post('/dynamic', (0, upload_1.createUpload)().single('file'), upload_1.uploadDynamic);
// 获取支持的上传类型信息
router.get('/types', (req, res) => {
    res.json({
        success: true,
        data: {
            types: upload_1.UPLOAD_TYPES,
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
exports.default = router;
