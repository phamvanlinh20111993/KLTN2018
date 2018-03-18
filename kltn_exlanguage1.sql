-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 17, 2018 at 12:44 PM
-- Server version: 10.1.25-MariaDB
-- PHP Version: 7.0.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kltn_exlanguage`
--

CREATE DATABASE IF NOT EXISTS `KLTN_ExLanguage` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `KLTN_ExLanguage`;

-- --------------------------------------------------------

--
-- Table structure for table `blocklist_admin`
--

CREATE TABLE `blocklist_admin` (
  `id` int(8) UNSIGNED NOT NULL,
  `blockwho` bigint(30) UNSIGNED NOT NULL,
  `timeblock` datetime NOT NULL,
  `content_id` int(8) NOT NULL,
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `blocklist_admin_content`
--

CREATE TABLE `blocklist_admin_content` (
  `id` int(8) UNSIGNED NOT NULL,
  `code` varchar(10) NOT NULL,
  `content` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `blocklist_user`
--

CREATE TABLE `blocklist_user` (
  `id` int(8) UNSIGNED NOT NULL,
  `whoblock` bigint(30) UNSIGNED NOT NULL,
  `blockwho` bigint(30) UNSIGNED NOT NULL,
  `timeblock` datetime NOT NULL,
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `blocklist_user`
--

INSERT INTO `blocklist_user` (`id`, `whoblock`, `blockwho`, `timeblock`, `time`) VALUES
(1, 1090168801152655, 402629716513658300, '2018-03-28 17:32:34', '2018-03-16 11:43:41');

-- --------------------------------------------------------

--
-- Table structure for table `blockmessages`
--

CREATE TABLE `blockmessages` (
  `id` int(9) UNSIGNED NOT NULL,
  `whoblock` bigint(30) UNSIGNED NOT NULL,
  `blockwho` bigint(30) UNSIGNED NOT NULL,
  `time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `checkmisspellings`
--

CREATE TABLE `checkmisspellings` (
  `id` int(9) UNSIGNED NOT NULL,
  `whocheck` bigint(30) UNSIGNED NOT NULL,
  `checkwho` bigint(30) UNSIGNED NOT NULL,
  `value` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` bigint(30) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(30) UNSIGNED NOT NULL,
  `content` varchar(5000) NOT NULL,
  `time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `degree`
--

CREATE TABLE `degree` (
  `id` int(4) UNSIGNED NOT NULL,
  `name` varchar(500) NOT NULL,
  `photo` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `degree`
--

INSERT INTO `degree` (`id`, `name`, `photo`) VALUES
(1, 'Beginner', NULL),
(2, 'Elementary', NULL),
(3, 'Intermediate', NULL),
(4, 'Advanced', NULL),
(5, 'Expert', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `delconversation`
--

CREATE TABLE `delconversation` (
  `id` int(9) UNSIGNED NOT NULL,
  `whodel` bigint(30) UNSIGNED NOT NULL,
  `delwho` bigint(30) UNSIGNED NOT NULL,
  `time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `editmessage`
--

CREATE TABLE `editmessage` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `message_id` bigint(40) UNSIGNED NOT NULL,
  `whoedit` bigint(30) UNSIGNED NOT NULL,
  `newcontent` varchar(5000) NOT NULL,
  `time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `exchangelg`
--

CREATE TABLE `exchangelg` (
  `id` int(4) UNSIGNED NOT NULL,
  `user_id` bigint(30) UNSIGNED NOT NULL,
  `degree_id` int(4) UNSIGNED NOT NULL,
  `language_id` int(4) UNSIGNED NOT NULL,
  `time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `exchangelg`
--

INSERT INTO `exchangelg` (`id`, `user_id`, `degree_id`, `language_id`, `time`) VALUES
(4, 1090168801152655, 1, 7, '2018-03-14 02:44:26'),
(5, 660454276020380500, 1, 7, '2018-03-14 03:20:22'),
(6, 804260829616815200, 2, 7, '2018-03-14 03:23:36'),
(7, 18446744073709551615, 3, 7, '2018-03-14 19:33:44'),
(9, 402629716513658300, 1, 7, '2018-03-15 01:52:11'),
(10, 879091109123433100, 1, 1, '2018-03-15 02:24:08'),
(11, 879091109123433100, 4, 3, '2018-03-14 02:44:01'),
(12, 1090168801152655, 5, 2, '2018-03-14 08:13:09');

-- --------------------------------------------------------

--
-- Table structure for table `follow`
--

CREATE TABLE `follow` (
  `id` int(9) UNSIGNED NOT NULL,
  `followers` bigint(30) UNSIGNED NOT NULL,
  `tracked` bigint(30) UNSIGNED NOT NULL,
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `language`
--

CREATE TABLE `language` (
  `id` int(4) UNSIGNED NOT NULL,
  `name` varchar(500) NOT NULL,
  `symbol` varchar(100) NOT NULL,
  `photo` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `language`
--

INSERT INTO `language` (`id`, `name`, `symbol`, `photo`) VALUES
(1, 'Vietnamese', 'vi', NULL),
(2, 'French', 'fr', NULL),
(3, 'German', 'de', NULL),
(4, 'Italian', 'it', NULL),
(5, 'Korean', 'ko', NULL),
(6, 'Latin', 'lt', NULL),
(7, 'English', 'en', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `level`
--

CREATE TABLE `level` (
  `id` int(4) UNSIGNED NOT NULL,
  `level` int(3) UNSIGNED NOT NULL,
  `name` varchar(500) DEFAULT NULL,
  `score` int(10) UNSIGNED NOT NULL,
  `photo` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `level`
--

INSERT INTO `level` (`id`, `level`, `name`, `score`, `photo`) VALUES
(1, 0, NULL, 0, NULL),
(2, 1, NULL, 1000, NULL),
(3, 2, NULL, 2000, NULL),
(4, 3, NULL, 3000, NULL),
(5, 4, NULL, 4000, NULL),
(6, 5, NULL, 5000, NULL),
(7, 6, NULL, 6500, NULL),
(8, 7, NULL, 8000, NULL),
(9, 9, NULL, 9500, NULL),
(10, 10, NULL, 11000, NULL),
(11, 11, NULL, 12500, NULL),
(12, 12, NULL, 14000, NULL),
(13, 13, NULL, 15500, NULL),
(14, 14, NULL, 17000, NULL),
(15, 15, NULL, 18500, NULL),
(16, 16, NULL, 20500, NULL),
(17, 17, NULL, 22500, NULL),
(18, 18, NULL, 24500, NULL),
(19, 19, NULL, 26500, NULL),
(20, 20, NULL, 28500, NULL),
(21, 21, NULL, 30000, NULL),
(22, 22, NULL, 33000, NULL),
(23, 23, NULL, 360000, NULL),
(24, 24, NULL, 39000, NULL),
(25, 25, NULL, 45000, NULL),
(26, 26, NULL, 48000, NULL),
(27, 27, NULL, 52000, NULL),
(28, 28, NULL, 54000, NULL),
(29, 29, NULL, 58000, NULL),
(30, 30, NULL, 65000, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` bigint(40) UNSIGNED NOT NULL,
  `userA` bigint(30) UNSIGNED NOT NULL,
  `userB` bigint(30) UNSIGNED NOT NULL,
  `data` blob,
  `content` varchar(5000) NOT NULL,
  `check` int(1) NOT NULL,
  `time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`id`, `userA`, `userB`, `data`, `content`, `check`, `time`) VALUES
(1, 804260829616815200, 1090168801152655, NULL, 'chung ta se la gi nhi', 1, '2018-03-17 16:26:34'),
(2, 1090168801152655, 804260829616815200, NULL, 'khong biet ke di', 1, '2018-03-17 20:18:43');

-- --------------------------------------------------------

--
-- Table structure for table `nativelg`
--

CREATE TABLE `nativelg` (
  `id` int(4) UNSIGNED NOT NULL,
  `user_id` bigint(30) UNSIGNED NOT NULL,
  `language_id` int(4) UNSIGNED NOT NULL,
  `time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `nativelg`
--

INSERT INTO `nativelg` (`id`, `user_id`, `language_id`, `time`) VALUES
(3, 1090168801152655, 7, '2018-03-14 02:44:27'),
(4, 660454276020380500, 7, '2018-03-14 03:20:22'),
(5, 804260829616815200, 7, '2018-03-14 03:23:37'),
(6, 18446744073709551615, 7, '2018-03-14 19:33:44'),
(8, 402629716513658300, 7, '2018-03-15 01:52:11'),
(9, 879091109123433100, 1, '2018-03-15 02:24:08');

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(30) UNSIGNED NOT NULL,
  `content` varchar(5000) NOT NULL,
  `file` varchar(1000) DEFAULT NULL,
  `nameoffile` varchar(500) DEFAULT NULL,
  `time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `report_post_comment`
--

CREATE TABLE `report_post_comment` (
  `id` int(8) UNSIGNED NOT NULL,
  `whoreport` bigint(30) UNSIGNED NOT NULL,
  `reportwho` bigint(30) UNSIGNED NOT NULL,
  `code` int(8) UNSIGNED NOT NULL,
  `type` int(8) UNSIGNED NOT NULL,
  `state` int(1) NOT NULL,
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `report_post_comment_content`
--

CREATE TABLE `report_post_comment_content` (
  `id` int(8) UNSIGNED NOT NULL,
  `code` varchar(20) NOT NULL,
  `content` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `report_post_comment_content`
--

INSERT INTO `report_post_comment_content` (`id`, `code`, `content`) VALUES
(1, '3DFLF', 'Reactionary content'),
(2, 'DDDDS', 'Pornographic content'),
(3, '12SDA', 'Violent content'),
(4, 'VVCw1', 'Impolite content'),
(5, 'PD342', 'Harassment content'),
(6, 'AA112', 'Offensive content'),
(7, 'GF334', 'Spam content');

-- --------------------------------------------------------

--
-- Table structure for table `report_user`
--

CREATE TABLE `report_user` (
  `id` int(8) UNSIGNED NOT NULL,
  `whoreport` bigint(30) UNSIGNED NOT NULL,
  `reportwho` bigint(30) UNSIGNED NOT NULL,
  `code` int(8) UNSIGNED NOT NULL,
  `state` int(1) NOT NULL,
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `report_user_content`
--

CREATE TABLE `report_user_content` (
  `id` int(8) UNSIGNED NOT NULL,
  `code` varchar(20) NOT NULL,
  `content` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `report_user_content`
--

INSERT INTO `report_user_content` (`id`, `code`, `content`) VALUES
(1, 'AS118', 'Bullying or harassment'),
(2, 'MN2GH', 'Sexual violence and exploitation'),
(3, 'GG2DC', 'Impolite human'),
(4, 'DF334', 'deliberately provocative');

-- --------------------------------------------------------

--
-- Table structure for table `setting`
--

CREATE TABLE `setting` (
  `id` int(3) UNSIGNED NOT NULL,
  `user_id` bigint(30) UNSIGNED NOT NULL,
  `turnofnotify` int(1) DEFAULT NULL,
  `turnofsound` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `type`
--

CREATE TABLE `type` (
  `id` int(8) UNSIGNED NOT NULL,
  `code` varchar(20) NOT NULL,
  `content` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `type`
--

INSERT INTO `type` (`id`, `code`, `content`) VALUES
(1, '1000A', 'comment'),
(2, '2000V', 'post'),
(3, '5000F', 'message'),
(4, '3001D', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` bigint(30) UNSIGNED NOT NULL,
  `email` varchar(500) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `des` varchar(2000) NOT NULL,
  `score` int(8) NOT NULL,
  `level_id` int(4) UNSIGNED NOT NULL,
  `photo` varchar(2000) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `provider` varchar(50) NOT NULL,
  `dateofbirth` datetime NOT NULL,
  `state` int(1) NOT NULL,
  `stay` int(1) NOT NULL,
  `admin` int(1) NOT NULL,
  `creatime` datetime NOT NULL,
  `time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `name`, `des`, `score`, `level_id`, `photo`, `gender`, `provider`, `dateofbirth`, `state`, `stay`, `admin`, `creatime`, `time`) VALUES
(1090168801152655, 'ngannt1710@gmail.com', NULL, 'Lạc Lạc', 'vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv', 0, 1, 'https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/23754830_1014103178759218_3255625551533095662_n.jpg?oh=9dabdadea73cff04c604f128b6e1faad&oe=5B453E55', 'female', 'facebook', '1948-08-14 00:00:00', 0, 0, 0, '2018-03-14 02:44:26', '2018-03-16 08:31:43'),
(402629716513658300, '14020822@vnu.edu.vn', 'U2FsdGVkX1/DkPnKrZLX3SBw0theOsxg7rUulw11ToJcu1twzY6emnBFWOVnO4iV', 'Tran dai nhan', 'rat thich giao tiep voi moi nguoi, to rat yeu giao tiep yeu duong lang nhang chan that neu khong kiem che duoc cam xuc thi se la no le cua cam xuc', 0, 1, '/data/img/402629716513658286/kApIh0hA7EoS0KxVIpEes6yDG7A8m9Zg5hEmZYVD1LUHJ.png', 'male', 'custom', '1997-07-06 00:00:00', 1, 1, 0, '2018-03-15 01:52:11', '2018-03-14 20:51:51'),
(660454276020380500, 'phamvanlinh08061995@gmail.com', 'U2FsdGVkX1+PKgMkTztfI7HqoRrs6zN/ZJS9iluko3PILhwkQlPRpK6aea8O0VBK', 'Nguyễn Ngàn ngu ngớ', 'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', 0, 1, '/data/img/660454276020380604/ac92SsG9hcxp8sGUWpbhSh58BCUlj4eLwJsvFwEbl7KYf.png', 'male', 'custom', '1951-06-10 00:00:00', 0, 0, 0, '2018-03-14 03:20:22', '2018-03-14 20:51:59'),
(804260829616815200, 'phamvanlinh20111993@gmail.com', 'U2FsdGVkX1/Adt8pRN6k9yH9rcVHf7V4Wvo8WnlIFubOktcf/EkKfgtOau6m3e8Y', 'NamiCambell', 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', 0, 1, '/data/img/804260829616815190/22wjwu5NQ2qBbLCYfiDxFXTYfMh3DClarc2x6DF38vyFm.png', 'male', 'custom', '1949-10-09 00:00:00', 1, 1, 1, '2018-03-14 03:23:36', '2018-03-16 08:38:18'),
(879091109123433100, '14020323@vnu.edu.vn', 'U2FsdGVkX1+lPiPslnLoDR2R2b/RNevO0p4kZKw6MmsoDSrY5Ic7xvs0FySJQ75W', 'Nguyễn Ngàn', 'ewffffffffffffffffffffffffffffffffeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', 0, 1, '/data/img/879091109123433092/TGtTxqfaqXjZ9ATrshKyqspXaJ6KsbWx5XK43IjM8F4N3.png', 'male', 'custom', '2011-06-05 00:00:00', 1, 1, 0, '2018-03-15 02:24:08', '2018-03-14 20:52:04'),
(18446744073709551615, 'duanwebptudweb@gmail.com', NULL, 'Web DuAn', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 0, 1, 'https://lh6.googleusercontent.com/-UDk_IK-gSek/AAAAAAAAAAI/AAAAAAAAAAs/0uoreIUR760/photo.jpg?sz=50', 'male', 'google', '1947-09-12 00:00:00', 0, 0, 0, '2018-03-14 19:33:44', '0000-00-00 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blocklist_admin`
--
ALTER TABLE `blocklist_admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `block by admin` (`blockwho`);

--
-- Indexes for table `blocklist_admin_content`
--
ALTER TABLE `blocklist_admin_content`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blocklist_user`
--
ALTER TABLE `blocklist_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `who want block` (`whoblock`),
  ADD KEY `who was block` (`blockwho`);

--
-- Indexes for table `blockmessages`
--
ALTER TABLE `blockmessages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `who want block message` (`whoblock`),
  ADD KEY `who was block message` (`blockwho`);

--
-- Indexes for table `checkmisspellings`
--
ALTER TABLE `checkmisspellings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `check with who` (`checkwho`),
  ADD KEY `who want check` (`whocheck`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id of post` (`post_id`),
  ADD KEY `idusercomment` (`user_id`);

--
-- Indexes for table `degree`
--
ALTER TABLE `degree`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `delconversation`
--
ALTER TABLE `delconversation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `who want del` (`whodel`),
  ADD KEY `who was del` (`delwho`);

--
-- Indexes for table `editmessage`
--
ALTER TABLE `editmessage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fix message` (`message_id`),
  ADD KEY `who fix message` (`whoedit`);

--
-- Indexes for table `exchangelg`
--
ALTER TABLE `exchangelg`
  ADD PRIMARY KEY (`id`),
  ADD KEY `language in exchange language` (`language_id`),
  ADD KEY `id of user in exchange` (`user_id`),
  ADD KEY `degree of user` (`degree_id`);

--
-- Indexes for table `follow`
--
ALTER TABLE `follow`
  ADD PRIMARY KEY (`id`),
  ADD KEY `person follow` (`followers`),
  ADD KEY `person was followed` (`tracked`);

--
-- Indexes for table `language`
--
ALTER TABLE `language`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `level`
--
ALTER TABLE `level`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id user A` (`userA`),
  ADD KEY `id user B` (`userB`);

--
-- Indexes for table `nativelg`
--
ALTER TABLE `nativelg`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id of user in native` (`user_id`),
  ADD KEY `language in native` (`language_id`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `iduserpost` (`user_id`);

--
-- Indexes for table `report_post_comment`
--
ALTER TABLE `report_post_comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `who want report` (`whoreport`),
  ADD KEY `who was report` (`reportwho`),
  ADD KEY `type of report` (`type`),
  ADD KEY `code report value` (`code`);

--
-- Indexes for table `report_post_comment_content`
--
ALTER TABLE `report_post_comment_content`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `report_user`
--
ALTER TABLE `report_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `who want report1` (`whoreport`),
  ADD KEY `who was report1` (`reportwho`),
  ADD KEY `code report1 user` (`code`);

--
-- Indexes for table `report_user_content`
--
ALTER TABLE `report_user_content`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `setting`
--
ALTER TABLE `setting`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id of user` (`user_id`);

--
-- Indexes for table `type`
--
ALTER TABLE `type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `level user` (`level_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blocklist_admin`
--
ALTER TABLE `blocklist_admin`
  MODIFY `id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `blocklist_admin_content`
--
ALTER TABLE `blocklist_admin_content`
  MODIFY `id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `blocklist_user`
--
ALTER TABLE `blocklist_user`
  MODIFY `id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `blockmessages`
--
ALTER TABLE `blockmessages`
  MODIFY `id` int(9) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `checkmisspellings`
--
ALTER TABLE `checkmisspellings`
  MODIFY `id` int(9) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` bigint(30) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `degree`
--
ALTER TABLE `degree`
  MODIFY `id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `delconversation`
--
ALTER TABLE `delconversation`
  MODIFY `id` int(9) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `editmessage`
--
ALTER TABLE `editmessage`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `exchangelg`
--
ALTER TABLE `exchangelg`
  MODIFY `id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `follow`
--
ALTER TABLE `follow`
  MODIFY `id` int(9) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `language`
--
ALTER TABLE `language`
  MODIFY `id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `level`
--
ALTER TABLE `level`
  MODIFY `id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` bigint(40) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `nativelg`
--
ALTER TABLE `nativelg`
  MODIFY `id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `report_post_comment`
--
ALTER TABLE `report_post_comment`
  MODIFY `id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `report_post_comment_content`
--
ALTER TABLE `report_post_comment_content`
  MODIFY `id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `report_user`
--
ALTER TABLE `report_user`
  MODIFY `id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `report_user_content`
--
ALTER TABLE `report_user_content`
  MODIFY `id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `setting`
--
ALTER TABLE `setting`
  MODIFY `id` int(3) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `type`
--
ALTER TABLE `type`
  MODIFY `id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `blocklist_admin`
--
ALTER TABLE `blocklist_admin`
  ADD CONSTRAINT `block by admin` FOREIGN KEY (`blockwho`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `blocklist_user`
--
ALTER TABLE `blocklist_user`
  ADD CONSTRAINT `who want block` FOREIGN KEY (`whoblock`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `who was block` FOREIGN KEY (`blockwho`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `blockmessages`
--
ALTER TABLE `blockmessages`
  ADD CONSTRAINT `who want block message` FOREIGN KEY (`whoblock`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `who was block message` FOREIGN KEY (`blockwho`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `checkmisspellings`
--
ALTER TABLE `checkmisspellings`
  ADD CONSTRAINT `check with who` FOREIGN KEY (`checkwho`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `who want check` FOREIGN KEY (`whocheck`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `id of post` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idusercomment` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `delconversation`
--
ALTER TABLE `delconversation`
  ADD CONSTRAINT `who want del` FOREIGN KEY (`whodel`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `who was del` FOREIGN KEY (`delwho`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `editmessage`
--
ALTER TABLE `editmessage`
  ADD CONSTRAINT `fix message` FOREIGN KEY (`message_id`) REFERENCES `message` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `who fix message` FOREIGN KEY (`whoedit`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `exchangelg`
--
ALTER TABLE `exchangelg`
  ADD CONSTRAINT `degree of user` FOREIGN KEY (`degree_id`) REFERENCES `degree` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id of user in exchange` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `language in exchange language` FOREIGN KEY (`language_id`) REFERENCES `language` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `follow`
--
ALTER TABLE `follow`
  ADD CONSTRAINT `person follow` FOREIGN KEY (`followers`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `person was followed` FOREIGN KEY (`tracked`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `id user A` FOREIGN KEY (`userA`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id user B` FOREIGN KEY (`userB`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `nativelg`
--
ALTER TABLE `nativelg`
  ADD CONSTRAINT `id of user in native` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `language in native` FOREIGN KEY (`language_id`) REFERENCES `language` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `iduserpost` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `report_post_comment`
--
ALTER TABLE `report_post_comment`
  ADD CONSTRAINT `code report value` FOREIGN KEY (`code`) REFERENCES `report_post_comment_content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `type of report` FOREIGN KEY (`type`) REFERENCES `type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `who want report` FOREIGN KEY (`whoreport`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `who was report` FOREIGN KEY (`reportwho`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `report_user`
--
ALTER TABLE `report_user`
  ADD CONSTRAINT `code report1 user` FOREIGN KEY (`code`) REFERENCES `report_user_content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `who want report1` FOREIGN KEY (`whoreport`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `who was report1` FOREIGN KEY (`reportwho`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `setting`
--
ALTER TABLE `setting`
  ADD CONSTRAINT `id of user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `level user` FOREIGN KEY (`level_id`) REFERENCES `level` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
