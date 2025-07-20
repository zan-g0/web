-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2025-07-20 18:05:51
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
-- 表的结构 `company_profile_qygk`
--

CREATE TABLE `company_profile_qygk` (
  `id` int(11) NOT NULL,
  `content` text COLLATE utf8_unicode_ci COMMENT '企业介绍HTML内容',
  `img_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '企业介绍图片URL',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `company_profile_ryzz`
--

CREATE TABLE `company_profile_ryzz` (
  `id` int(11) NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '荣誉描述',
  `img_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '荣誉图片url',
  `updata_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `company_slides`
--

CREATE TABLE `company_slides` (
  `id` int(11) NOT NULL,
  `image_url` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '轮播图URL'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `contact_information`
--

CREATE TABLE `contact_information` (
  `id` int(11) NOT NULL COMMENT '主键ID',
  `company_phone` varchar(20) NOT NULL COMMENT '公司总机',
  `sales_hotline` varchar(20) NOT NULL COMMENT '销售服务热线',
  `fax` varchar(20) DEFAULT NULL COMMENT '传真号码',
  `email` varchar(50) NOT NULL COMMENT '企业邮箱',
  `address` varchar(100) NOT NULL COMMENT '详细地址',
  `postal_code` char(6) DEFAULT NULL COMMENT '邮政编码',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `QRcode_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '二维码url'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='企业联系信息表';

-- --------------------------------------------------------

--
-- 表的结构 `job_openings`
--

CREATE TABLE `job_openings` (
  `id` int(11) NOT NULL COMMENT '主键ID',
  `position_name` varchar(50) NOT NULL COMMENT '岗位名称（如：水稻育种研究员）',
  `position_requirements` text NOT NULL COMMENT '岗位要求（支持HTML格式）',
  `salary_range` varchar(30) NOT NULL COMMENT '薪资待遇（如：8K-15K）',
  `hire_number` tinyint(3) UNSIGNED NOT NULL COMMENT '招聘人数',
  `is_published` tinyint(1) DEFAULT '0' COMMENT '是否发布（0-未发布 1-已发布）',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人才招聘信息表';

-- --------------------------------------------------------

--
-- 表的结构 `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8_unicode_ci COMMENT '富文本内容',
  `publish_time` datetime NOT NULL,
  `view_count` int(11) DEFAULT '0',
  `is_top` tinyint(1) DEFAULT '0' COMMENT '是否置顶'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `rice_products`
--

CREATE TABLE `rice_products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '水稻品种名称',
  `feature` text COLLATE utf8_unicode_ci COMMENT '产品特性',
  `spec_params` json DEFAULT NULL COMMENT '规格参数JSON存储',
  `cover_image` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '封面图URL',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转储表的索引
--

--
-- 表的索引 `company_profile_qygk`
--
ALTER TABLE `company_profile_qygk`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `company_profile_ryzz`
--
ALTER TABLE `company_profile_ryzz`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `company_slides`
--
ALTER TABLE `company_slides`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `contact_information`
--
ALTER TABLE `contact_information`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `job_openings`
--
ALTER TABLE `job_openings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_published` (`is_published`);

--
-- 表的索引 `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `rice_products`
--
ALTER TABLE `rice_products`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `company_profile_qygk`
--
ALTER TABLE `company_profile_qygk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `company_profile_ryzz`
--
ALTER TABLE `company_profile_ryzz`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `company_slides`
--
ALTER TABLE `company_slides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `contact_information`
--
ALTER TABLE `contact_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID';

--
-- 使用表AUTO_INCREMENT `job_openings`
--
ALTER TABLE `job_openings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID';

--
-- 使用表AUTO_INCREMENT `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `rice_products`
--
ALTER TABLE `rice_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
