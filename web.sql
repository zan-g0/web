-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2026-02-26 16:58:09
-- 服务器版本： 5.7.26
-- PHP 版本： 7.3.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `web`
--

-- --------------------------------------------------------

--
-- 表的结构 `about_profile`
--

CREATE TABLE `about_profile` (
  `id` int(11) NOT NULL,
  `txt` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '段落内容',
  `order` int(11) NOT NULL DEFAULT '0' COMMENT '排序权重',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `about_profile`
--

INSERT INTO `about_profile` (`id`, `txt`, `order`, `is_active`) VALUES
(5, '浙江科原种业有限公司是一家集科研、繁育、生产加工、推广营销为一体的专业化种业公司，为浙江省科技型企业。公司科研育种技术力量雄厚，主要研发优质杂交水稻，致力于推广米质优、口感好、高产、多抗兼顾型杂交稻，为南方稻区水稻生产与农民增收服务，满足广大消费者对稻米消费升级需求。相继成功研发优质口感型杂交稻泰两优系列；优质、高产兼顾杂交稻原两优系列；优质超高产籼粳杂交稻原优系列品种，推广面积逐年增加。公司建有温州、海南等育种基地，在浙、赣、闽、湘、皖、桂、川、苏、琼等地设立生态测试点。在湖南、福建、江苏、上海等建立制种生产基地。在南方稻区主要地区建立了稳定的产品销售渠道，销售网络覆盖近10多个省市区，与江苏红旗、湖南兆和种业、广西川种等种业龙头企业建立长期代理合作关系，销售量逐年快速增长。', 1, 1),
(6, '许可项目：农作物种子经营；主要农作物种子生产；农药批发；农药零售（依法须经批准的项目，经相关部门批准后方可开展经营活动，具体经营项目以审批结果为准）。一般项目：农业机械制造；农业机械销售；非主要农作物种子生产；农作物种子经营（仅限不再分装的包装种子）；化肥销售；肥料销售；农业科学研究和试验发展；智能农业管理；农业专业及辅助性活动；技术服务、技术开发、技术咨询、技术交流、技术转让、技术推广；科技中介服务；生物基材料技术研发；谷物种植；食用农产品初加工；初级农产品收购；农作物病虫害防治服务（除依法须经批准的项目外，凭营业执照依法自主开展经营活动）。', 2, 1);

-- --------------------------------------------------------

--
-- 表的结构 `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `image_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '轮播图文件名'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `banners`
--

INSERT INTO `banners` (`id`, `image_name`) VALUES
(1, 'banner1.jpg'),
(2, 'banner2.jpg'),
(3, 'banner3.jpg');

-- --------------------------------------------------------

--
-- 表的结构 `company_culture`
--

CREATE TABLE `company_culture` (
  `id` int(11) NOT NULL,
  `title` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '标题',
  `content` text COLLATE utf8_unicode_ci NOT NULL COMMENT '详细内容',
  `icon_img` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '图标文件名',
  `order` int(11) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `company_culture`
--

INSERT INTO `company_culture` (`id`, `title`, `content`, `icon_img`, `order`, `is_active`) VALUES
(1, '指导思想', '[\"产业为本,战略为势\",\"创新为魂,金融为器\"]', 'wh1.png', 1, 1),
(2, '企业使命', '[\"引领农业,造富三农\",\"造福社会,保护自然\"]', 'wh2.png', 2, 1),
(3, '指导思想', '[\"企业精神\",\"太阳每天都在升起\",\"我们每天都在努力\"]', 'wh3.png', 3, 1),
(4, '质量方针', '[\"用心培育每一个品种\",\"精心生产每一粒种子\",\"真心善待每一位客户\"]', 'wh4.png', 4, 1),
(5, '人文环境', '[\"围绕企业发展\",\"员工成长,回报社会\",\"追求和谐统一\"]', 'wh5.png', 5, 1),
(6, '企业人才观', '[\"人品在先,注重能力\",\"任人唯贤,能上能下\",\"事业留人,感情留人\",\"待遇留人\"]', 'wh6.png', 6, 1),
(7, '宣传用语', '[\"发展民族种业,致力高新科技\",\"诚信服务农业,播科原良种，奔小康生活\",\"品种源于创新，品质成就未来\"]', 'wh7.png', 7, 1);

-- --------------------------------------------------------

--
-- 表的结构 `company_honors`
--

CREATE TABLE `company_honors` (
  `id` int(11) NOT NULL,
  `title` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `image` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `order` int(11) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `company_honors`
--

INSERT INTO `company_honors` (`id`, `title`, `description`, `image`, `order`, `is_active`) VALUES
(1, '荣誉1', '荣誉1', 'ry1.jpg', 1, 1),
(2, '荣誉2', 'rongyu2', 'ry2.jpg', 2, 1),
(3, '荣誉3', '荣誉3', 'ry3.jpg', 3, 1),
(4, '荣誉4', '国家级农业龙头企业', 'ry4.jpg', 4, 1);

-- --------------------------------------------------------

--
-- 表的结构 `contact_info`
--

CREATE TABLE `contact_info` (
  `id` int(11) NOT NULL,
  `company_phone` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '公司电话',
  `service_phone` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '销售服务热线',
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `postal_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '邮编',
  `address` text COLLATE utf8_unicode_ci COMMENT '地址',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `contact_info`
--

INSERT INTO `contact_info` (`id`, `company_phone`, `service_phone`, `email`, `postal_code`, `address`, `created_at`, `updated_at`) VALUES
(1, '188 1500 3185', '188 1500 3185', 'contact@company.com', '325000', '浙江省温州市瓯海区郭溪街道西陶路12号4幢', '2025-08-24 02:13:43', '2026-02-25 10:00:31');

-- --------------------------------------------------------

--
-- 表的结构 `job_positions`
--

CREATE TABLE `job_positions` (
  `id` int(11) NOT NULL,
  `category` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '岗位类别',
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '岗位名称',
  `requirements` text COLLATE utf8_unicode_ci NOT NULL COMMENT '岗位要求',
  `salary_range` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '薪资待遇',
  `vacancy_count` int(11) DEFAULT '1' COMMENT '招聘人数',
  `display_order` int(11) DEFAULT '0' COMMENT '显示顺序',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '是否激活',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `job_positions`
--

INSERT INTO `job_positions` (`id`, `category`, `title`, `requirements`, `salary_range`, `vacancy_count`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '研发类', '分子育种研究员', '作物遗传学博士，具备分子标记辅助育种相关经验，能独立承担科研项目。\r\n1.负责农业生产过程中的技术指导与监督,确保技术方案的有效实施;\r\n2.参与作物种植规划,优化种植方案,提升作物产量与品质;\r\n3.监控农业生产环境,及时发现并解决生产过程中的技术问题;\r\n4.收集并分析生产数据,为农业生产提供科学依据;\r\n5.指导农民或合作农户进行标准化、规范化的农业生产操作。', '20-30万/年，五险一金，科研奖励', 3, 1, 1, '2025-08-24 09:37:35', '2026-02-25 10:44:36'),
(2, '技术类', '田间测试工程师', '3年及以上南繁基地田间测试经验，熟悉水稻生长周期与田间管理。', '10-15万/年，五险一金，绩效奖金', 3, 1, 1, '2025-08-24 09:37:35', '2026-02-25 10:41:27'),
(3, '销售类', '区域经理', '熟悉长江中下游水稻主产区，有农资销售经验，具备市场拓展能力。', '8-12万/年+提成，五险一金', 2, 3, 1, '2025-08-24 09:37:35', '2026-02-25 10:44:44');

-- --------------------------------------------------------

--
-- 表的结构 `news`
--

CREATE TABLE `news` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `cover_image` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `views` int(10) UNSIGNED DEFAULT '0',
  `publish_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `news`
--

INSERT INTO `news` (`id`, `title`, `summary`, `content`, `cover_image`, `category`, `author`, `status`, `views`, `publish_date`, `created_at`, `updated_at`) VALUES
(1, '公司荣获绿色示范企业', '公司在环保方面获得行业认可', '    优质稻品种食味品质鉴评活动的开展，旨在评选出适宜安徽省种植的优质食味水稻品种，进一步满足农业供给侧结构性改革对优质稻米品种的需求，推动我省水稻产业向优质化、品牌化方向发展。\r\n    我司参选的中籼品种泰两优1413，在此次评选中荣获金奖，充分展示了其米质的优质和口感的优越。同时在多年的大田推广中，泰两优1413以其强抗倒，分蘖能力强，有效穗多，结实率高保证了广大种植户的高产需求。\r\n    集高产与优质于一身的泰两优1413，以其超高的整精米率（平均整精米率达70%），深受各地米厂喜爱。和其他产品相比泰两优1413每百斤稻谷能多打出几斤大米，对于米厂来说商业价值和利润空间大大提升！', 'cover1.jpg', '公司新闻', '张经理', 'published', 29, '2026-02-01 09:00:00', '2026-02-21 22:01:42', '2026-02-24 23:13:58'),
(2, '新品上市：智能农业监测系统', '简介与应用场景', '详细内容...', 'cover2.jpg', '产品新闻', '李工程师', 'published', 20, '2026-02-10 10:00:00', '2026-02-21 22:01:42', '2026-02-24 23:13:55'),
(3, '热烈祝贺高产优质品种泰两优1413荣获2021年安徽省优质稻食味品质金奖', '公司成就', '1月16日下午，2021年（第三届）安徽省优质稻品种食味品质鉴评活动在合肥举行。安徽省种子管理总站、安徽省水稻产业技术体系、安徽省种子协会联合组织专家对征集的优质米品种进行现场食味鉴评。\r\n我司参选的 高产型优质 品种泰两优1413荣获安徽省优质稻食味品质金奖！', 'cover1.jpg', '公司新闻', '小王', 'published', 41, '2026-02-21 22:30:41', '2026-02-21 22:28:32', '2026-02-24 23:30:52');

-- --------------------------------------------------------

--
-- 表的结构 `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '产品名称',
  `description` text COLLATE utf8_unicode_ci NOT NULL COMMENT '产品描述',
  `image_name` varchar(500) COLLATE utf8_unicode_ci NOT NULL COMMENT '产品图片名称',
  `display_order` int(11) DEFAULT '0' COMMENT '显示顺序',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '是否激活',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `image_name`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '水稻1', '高产优质水稻品种，抗病性强，适合大面积种植', '1.png', 1, 1, '2025-08-24 08:44:12', '2026-02-21 13:46:38'),
(2, '水稻2', '特色香米品种，米质优良，口感香甜', '2.png', 2, 1, '2025-08-24 08:44:12', '2025-08-24 08:44:12'),
(3, '水稻3', '抗旱节水型水稻，适合干旱地区种植', '3.png', 3, 1, '2025-08-24 08:44:12', '2025-08-24 08:44:12'),
(4, '水稻4', '早熟高产水稻品种，生长周期短，效益高', '4.png', 4, 1, '2025-08-24 08:44:12', '2025-08-24 08:44:12');

-- --------------------------------------------------------

--
-- 表的结构 `profileimage`
--

CREATE TABLE `profileimage` (
  `id` int(11) NOT NULL,
  `image_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '企业介绍图片名',
  `order` int(11) NOT NULL DEFAULT '0' COMMENT '排序权重',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `profileimage`
--

INSERT INTO `profileimage` (`id`, `image_name`, `order`, `is_active`) VALUES
(10, 'Screenshot_2026_0207_201306_1770466661016_srz02k.png', 1, 1);

--
-- 转储表的索引
--

--
-- 表的索引 `about_profile`
--
ALTER TABLE `about_profile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order` (`order`),
  ADD KEY `idx_active` (`is_active`);

--
-- 表的索引 `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `company_culture`
--
ALTER TABLE `company_culture`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `company_honors`
--
ALTER TABLE `company_honors`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `contact_info`
--
ALTER TABLE `contact_info`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `job_positions`
--
ALTER TABLE `job_positions`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_publish_date` (`publish_date`),
  ADD KEY `idx_category` (`category`);

--
-- 表的索引 `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `profileimage`
--
ALTER TABLE `profileimage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order` (`order`),
  ADD KEY `is_active` (`is_active`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `about_profile`
--
ALTER TABLE `about_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- 使用表AUTO_INCREMENT `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- 使用表AUTO_INCREMENT `company_culture`
--
ALTER TABLE `company_culture`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- 使用表AUTO_INCREMENT `company_honors`
--
ALTER TABLE `company_honors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用表AUTO_INCREMENT `contact_info`
--
ALTER TABLE `contact_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用表AUTO_INCREMENT `job_positions`
--
ALTER TABLE `job_positions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用表AUTO_INCREMENT `news`
--
ALTER TABLE `news`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用表AUTO_INCREMENT `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用表AUTO_INCREMENT `profileimage`
--
ALTER TABLE `profileimage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
