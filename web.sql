-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2025-08-24 20:21:46
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
(1, 'XX农业公司成立于2010年，专注于绿色农产品的研发与种植。', 1, 1),
(2, '我们拥有2000亩有机种植基地，通过ISO9001国际质量体系认证。', 3, 1),
(3, '公司秉承\"自然、健康、可持续\"的发展理念，年产值超5000万元。', 2, 1),
(4, '农作物种子经营；主要农作物种子生产；农药批发；农药零售(依法须经批准的项目，经相关部门批准后方可开展经营活动，具体经营项目以审批结果为准)。一般项目：农业机械制造；农业机械销售；非主要农作物种子生产；农作物种子经营（仅限不再分装的包装种子）；化肥销售；肥料销售；农业科学研究和试验发展；智能农业管理；农业专业及辅助性活动；技术服务、技术开发、技术咨询、技术交流、技术转让、技术推广；科技中介服务；生物基材料技术研发；谷物种植；食用农产品初加工；初级农产品收购；农作物病虫害防治服务(除依法须经批准的项目外，凭营业执照依法自主开展经营活动)。', 4, 1);

-- --------------------------------------------------------

--
-- 表的结构 `about_profile_img`
--

CREATE TABLE `about_profile_img` (
  `id` int(11) NOT NULL,
  `img_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '企业介绍图片名',
  `order` int(11) NOT NULL DEFAULT '0' COMMENT '排序权重',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `about_profile_img`
--

INSERT INTO `about_profile_img` (`id`, `img_name`, `order`, `is_active`) VALUES
(1, 'dl1.jpg', 1, 1),
(2, 'dl2.jpg', 2, 1);

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
(1, '荣誉1', 'rongyu1', 'ry1.jpg', 1, 1),
(2, '荣誉2', 'rongyu2', 'ry2.jpg', 2, 1),
(3, '荣誉3', 'rongyu3', 'ry3.jpg', 3, 1),
(4, '荣誉4', '国家级农业龙头企业', 'ry4.jpg', 4, 1);

-- --------------------------------------------------------

--
-- 表的结构 `contact_info`
--

CREATE TABLE `contact_info` (
  `id` int(11) NOT NULL,
  `company_phone` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '公司电话',
  `service_phone` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '销售服务热线',
  `fax` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '传真',
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `postal_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '邮编',
  `address` text COLLATE utf8_unicode_ci COMMENT '地址',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '是否激活',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `contact_info`
--

INSERT INTO `contact_info` (`id`, `company_phone`, `service_phone`, `fax`, `email`, `postal_code`, `address`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '0571-88888888', '400-123-4567', '0571-88888887', 'contact@company.com', '325000', '浙江省温州市瓯海区郭溪街道西陶路12号4幢', 1, '2025-08-24 10:13:43', '2025-08-24 10:13:43');

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
(1, '研发类', '分子育种研究员', '作物遗传学博士，具备分子标记辅助育种相关经验，能独立承担科研项目。', '20-30万/年，五险一金，科研奖励', 2, 1, 1, '2025-08-24 09:37:35', '2025-08-24 09:37:35'),
(2, '技术类', '田间测试工程师', '3年及以上南繁基地田间测试经验，熟悉水稻生长周期与田间管理。', '10-15万/年，五险一金，绩效奖金', 3, 2, 1, '2025-08-24 09:37:35', '2025-08-24 09:37:35'),
(3, '销售类', '区域经理', '熟悉长江中下游水稻主产区，有农资销售经验，具备市场拓展能力。', '8-12万/年+提成，五险一金', 2, 3, 1, '2025-08-24 09:37:35', '2025-08-24 09:37:35');

-- --------------------------------------------------------

--
-- 表的结构 `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `class_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '分类名称',
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '新闻标题',
  `content` text COLLATE utf8_unicode_ci NOT NULL COMMENT '新闻内容',
  `view_count` int(11) DEFAULT '0' COMMENT '排序编号',
  `is_top` tinyint(1) DEFAULT '0' COMMENT '是否置顶',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '是否激活',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `news`
--

INSERT INTO `news` (`id`, `class_name`, `title`, `content`, `view_count`, `is_top`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '公司新闻', '新品种发布会圆满举行', '我司成功举办水稻新品种发布会，吸引众多行业专家与合作伙伴。', 1, 1, 1, '2025-08-24 03:55:42', '2025-08-24 03:55:42'),
(2, '公司新闻', '战略合作签约', '与知名农业企业签署战略合作协议，推动种业创新发展。', 2, 0, 1, '2025-08-24 03:55:42', '2025-08-24 03:55:42'),
(3, '公司新闻', '领导活动', '省政府领导莅临考察，国际交流持续深化。', 3, 0, 1, '2025-08-24 03:55:42', '2025-08-24 03:55:42'),
(4, '行业资讯', '政策解读', '新《种子法》专家分析，助力企业合规发展。', 1, 1, 1, '2025-08-24 03:55:42', '2025-08-24 03:55:42'),
(5, '行业资讯', '市场报告', '水稻种业白皮书节选，洞察行业趋势与机遇。', 2, 0, 1, '2025-08-24 03:55:42', '2025-08-24 03:55:42'),
(6, '田间纪实', '品种试验跟踪报道', '科研团队深入田间，记录新品种生长表现。', 1, 0, 1, '2025-08-24 03:55:42', '2025-08-24 03:55:42'),
(7, '田间纪实', '农户种植案例', '“丰收故事”专题，分享农户成功经验与感人瞬间。', 2, 0, 1, '2025-08-24 03:55:42', '2025-08-24 03:55:42');

-- --------------------------------------------------------

--
-- 表的结构 `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '产品名称',
  `description` text COLLATE utf8_unicode_ci NOT NULL COMMENT '产品描述',
  `image_url` varchar(500) COLLATE utf8_unicode_ci NOT NULL COMMENT '产品图片路径',
  `display_order` int(11) DEFAULT '0' COMMENT '显示顺序',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '是否激活',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `image_url`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '水稻1', '高产优质水稻品种，抗病性强，适合大面积种植', '1.png', 1, 1, '2025-08-24 08:44:12', '2025-08-24 08:44:12'),
(2, '水稻2', '特色香米品种，米质优良，口感香甜', '2.png', 2, 1, '2025-08-24 08:44:12', '2025-08-24 08:44:12'),
(3, '水稻3', '抗旱节水型水稻，适合干旱地区种植', '3.png', 3, 1, '2025-08-24 08:44:12', '2025-08-24 08:44:12'),
(4, '水稻4', '早熟高产水稻品种，生长周期短，效益高', '4.png', 4, 1, '2025-08-24 08:44:12', '2025-08-24 08:44:12');

-- --------------------------------------------------------

--
-- 表的结构 `talent_concept`
--

CREATE TABLE `talent_concept` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '标题',
  `content` text COLLATE utf8_unicode_ci NOT NULL COMMENT '内容',
  `display_order` int(11) DEFAULT '0' COMMENT '显示顺序',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '是否激活',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `talent_concept`
--

INSERT INTO `talent_concept` (`id`, `title`, `content`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '人才理念', '我们坚持\"以人为本，创新驱动\"的人才理念，重视员工成长与发展，致力于打造开放、包容、协作的科研与工作环境。欢迎有志之士加入我们，共同推动农业科技进步！', 1, 1, '2025-08-24 09:37:35', '2025-08-24 09:37:35');

-- --------------------------------------------------------

--
-- 表的结构 `tech_achievements`
--

CREATE TABLE `tech_achievements` (
  `id` int(11) NOT NULL,
  `variety_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '品种名称',
  `lodging_resistance` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '抗倒伏性',
  `blast_resistance` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '稻瘟病抗性',
  `yield_performance` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '产量表现',
  `display_order` int(11) DEFAULT '0' COMMENT '显示顺序',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '是否激活',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `tech_achievements`
--

INSERT INTO `tech_achievements` (`id`, `variety_name`, `lodging_resistance`, `blast_resistance`, `yield_performance`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '科原优1号', '强', '高抗', '850kg/亩', 1, 1, '2025-08-24 06:22:34', '2025-08-24 06:22:34'),
(2, '科原优2号', '较强', '中抗', '820kg/亩', 2, 1, '2025-08-24 06:22:34', '2025-08-24 06:22:34'),
(3, '科原优3号', '强', '高抗', '870kg/亩', 3, 1, '2025-08-24 06:22:34', '2025-08-24 06:22:34');

-- --------------------------------------------------------

--
-- 表的结构 `tech_cooperations`
--

CREATE TABLE `tech_cooperations` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '标题',
  `description` text COLLATE utf8_unicode_ci NOT NULL COMMENT '描述',
  `image_urls` text COLLATE utf8_unicode_ci,
  `display_order` int(11) DEFAULT '0' COMMENT '显示顺序',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '是否激活',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `tech_cooperations`
--

INSERT INTO `tech_cooperations` (`id`, `title`, `description`, `image_urls`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '技术合作', '浙江科原种业科学研究有限公司与XXX公司，XXX大学等多家科研院所（校）建立了紧密的合作关系，取得了良好的成效', '[\"1.jpg\", \"2.jpg\"]', 1, 1, '2025-08-24 06:22:34', '2025-08-24 06:22:34');

-- --------------------------------------------------------

--
-- 表的结构 `tech_introductions`
--

CREATE TABLE `tech_introductions` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '标题',
  `content` text COLLATE utf8_unicode_ci NOT NULL COMMENT '内容',
  `image_url` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '图片路径',
  `display_order` int(11) DEFAULT '0' COMMENT '显示顺序',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '是否激活',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `tech_introductions`
--

INSERT INTO `tech_introductions` (`id`, `title`, `content`, `image_url`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '分子标记辅助育种', '分子标记辅助育种是利用分子标记与决定目标性状基因紧密连锁的特点，通过检测分子标记，即可检测到目的基因的存在，达到选择目标性状的目的，具有快速、准确、不受环境条件干扰的优点。可作为鉴别亲本亲缘关系，回交育种中数量性状和隐性性状的转移、杂种后代的选择、杂种优势的预测及品种纯度鉴定等各个育种环节的辅助手段。', 'tech_router.png', 1, 1, '2025-08-24 06:22:34', '2025-08-24 06:22:34');

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
-- 表的索引 `about_profile_img`
--
ALTER TABLE `about_profile_img`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order` (`order`),
  ADD KEY `is_active` (`is_active`);

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
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `talent_concept`
--
ALTER TABLE `talent_concept`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `tech_achievements`
--
ALTER TABLE `tech_achievements`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `tech_cooperations`
--
ALTER TABLE `tech_cooperations`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `tech_introductions`
--
ALTER TABLE `tech_introductions`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `about_profile`
--
ALTER TABLE `about_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用表AUTO_INCREMENT `about_profile_img`
--
ALTER TABLE `about_profile_img`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用表AUTO_INCREMENT `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用表AUTO_INCREMENT `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- 使用表AUTO_INCREMENT `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用表AUTO_INCREMENT `talent_concept`
--
ALTER TABLE `talent_concept`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用表AUTO_INCREMENT `tech_achievements`
--
ALTER TABLE `tech_achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用表AUTO_INCREMENT `tech_cooperations`
--
ALTER TABLE `tech_cooperations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用表AUTO_INCREMENT `tech_introductions`
--
ALTER TABLE `tech_introductions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
