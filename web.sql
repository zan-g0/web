-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2025-08-10 22:52:48
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

--
-- 转储表的索引
--

--
-- 表的索引 `company_culture`
--
ALTER TABLE `company_culture`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `company_culture`
--
ALTER TABLE `company_culture`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
