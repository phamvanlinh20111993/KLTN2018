SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `KLTN_ExLanguage` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `KLTN_ExLanguage`;


/*####################################################################################################### */

CREATE TABLE IF NOT EXISTS `User` (
  `id` bigint(30) UNSIGNED NOT NULL PRIMARY KEY,
  `email` varchar(500) NOT NULL,
  `password` varchar(100),
  `name` varchar(100) NOT NULL,
  `des` varchar(2000) NOT NULL,
  `score` int(8) NOT NULL,
  `photo` varchar(2000) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `provider` varchar(50) NOT NULL,
  `dateofbirth` DATETIME NOT NULL,
  `state` BIT NOT NULL,
  `stay` BIT NOT NULL,
  `level_id` int(4) UNSIGNED NOT NULL, /* trinh do, tien do*/
  `admin` BIT NOT NULL,
  `creatime` DATETIME NOT NULL,/* thoi gian khoi tao tai khoan nay */
  `ctime` TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `NativeLG`(
	`id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`user_id` bigint(30) UNSIGNED NOT NULL,
	`language_id` int(4) UNSIGNED NOT NULL,
	`time` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `ExchangeLG`(
	`id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`user_id` bigint(30) UNSIGNED NOT NULL,
  	`degree_id` int(4) UNSIGNED NOT NULL,/* bang cap */
	`language_id` int(4) UNSIGNED NOT NULL,
	`time` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 

CREATE TABLE IF NOT EXISTS `Follow`(
	`id` int(9) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`followers` bigint(30) UNSIGNED NOT NULL,/* ai la nguoi theo doi */
	`tracked` bigint(30) UNSIGNED NOT NULL,/* nguowi bi theo doi la ai */
	`ctime` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Language`(
	`id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(500) NOT NULL,
	`symbol` varchar(100) NOT NULL,
	`photo` varchar(1000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Degree`(/* beginning, advantage, expert*/
	`id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(500) NOT NULL,
	`photo` varchar(1000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Level`(/* level 1,2,3,4,5....*/
	`id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`level` int(3) UNSIGNED NOT NULL,
	`name` varchar(500),
	`score` int(10) UNSIGNED NOT NULL,
	`photo` varchar(1000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Message`(
	`id` bigint(40) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	`userA` bigint(30) UNSIGNED NOT NULL,/* Nguoi gui*/
	`userB` bigint(30) UNSIGNED NOT NULL,/* Nguoi nhan*/
	`data` BLOB,/* gui anh hoac am thanh*/
	`content` varchar(5000) NOT NULL,
	`check` int(1) NOT NULL,/*giá trị check thông báo đối phương đã xem tin nhắn hay chưa
				   đặt 0 là nguoi gui đã xem(default), 1 là nguoi nhan da xem*/
	`ctime` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Editmessage`(
	`id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`message_id` bigint(40) UNSIGNED NOT NULL,
	`whoedit` bigint(30) UNSIGNED NOT NULL,
	`newcontent` varchar(5000) NOT NULL,
	`ctime` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Delconversation`(
	`id` int(9) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`whodel` bigint(30) UNSIGNED NOT NULL,
	`delwho` bigint(30) UNSIGNED NOT NULL,
	`ctime` DATETIME NOT NULL/* xóa các tin nhắn đén thời điểm time*/
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Blockmessages`(
	`id` int(9) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`whoblock` bigint(30) UNSIGNED NOT NULL,
	`blockwho` bigint(30) UNSIGNED NOT NULL,
	`ctime` DATETIME NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Checkmisspellings`(
	`id` int(9) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`whocheck` bigint(30) UNSIGNED NOT NULL,
	`checkwho` bigint(30) UNSIGNED NOT NULL,
	`value` BIT NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Setting`(
	`id` int(3) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`user_id` bigint(30) UNSIGNED NOT NULL,
	`turnofnotify` BIT,
	`turnofsound` BIT
) ENGINE=InnoDB, CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Post`(
	`id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`user_id` bigint(30) UNSIGNED NOT NULL,
	`content` varchar(5000) NOT NULL,
	`title_id` int(4) UNSIGNED NOT NULL,
	`file` varchar(1000), /* dinh kem file luu dia chi url*/
	`nameoffile` varchar(500),
	`ctime` DATETIME NOT NULL,
	`turnof_cmt` int(1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Comment`(
	`id` bigint(30) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`post_id` bigint(20) UNSIGNED NOT NULL,
	`user_id` bigint(30) UNSIGNED NOT NULL,
	`content` varchar(5000) NOT NULL,
	`ctime` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Blocklist_user`(
	`id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`whoblock` bigint(30) UNSIGNED NOT NULL,
	`blockwho` bigint(30) UNSIGNED NOT NULL,
	`timeblock` DATETIME NOT NULL,
	`ctime` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Blocklist_admin`(
	`id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`blockwho` bigint(30) UNSIGNED NOT NULL,
	`timeblock` DATETIME NOT NULL,
	`content_id` int(8) NOT NULL,
	`ctime` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Blocklist_admin_content`(
	`id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`code` varchar(10) NOT NULL,
	`content` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Report_post_comment`( /* Report to admin */
	`id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`whoreport` bigint(30) UNSIGNED NOT NULL,
	`reportwho` bigint(30) UNSIGNED NOT NULL,
	`code` int(8) UNSIGNED NOT NULL,
	`type` int(8) UNSIGNED NOT NULL,/* report comment, post or user */
	`state` BIT NOT NULL,/* Admin read or not */
 	`ctime` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Report_post_comment_content`(
	`id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`code` varchar(20) NOT NULL,
	`content` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Type`(/* comment, user or post*/
	`id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`code` varchar(20) NOT NULL,
	`content` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Report_user`(
	`id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`whoreport` bigint(30) UNSIGNED NOT NULL,
	`reportwho` bigint(30) UNSIGNED NOT NULL,
	`code` int(8) UNSIGNED NOT NULL,
	`state` BIT NOT NULL,/* Admin read or not */
 	`ctime` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `Report_user_content`(
	`id` int(8) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`code` varchar(20) NOT NULL,
	`content` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `likes_post`(
	`id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`id_user` bigint(30) UNSIGNED NOT NULL,
	`id_post`  bigint(20) UNSIGNED NOT NULL,
	`ctime` DATETIME
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `post_title`(
	`id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(200) NOT NULL,
	`code` varchar(10) NOT NULL,
	`photo` varchar(1000)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*################################################################################################## */

ALTER TABLE `User`
    ADD CONSTRAINT `level user` FOREIGN KEY (`level_id`) REFERENCES `Level` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `NativeLG`
	ADD CONSTRAINT `id of user in native` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
 	ADD CONSTRAINT `language in native` FOREIGN KEY (`language_id`) REFERENCES `Language` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ExchangeLG` 
	ADD CONSTRAINT `language in exchange language` FOREIGN KEY (`language_id`) REFERENCES `Language` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `id of user in exchange` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  	ADD CONSTRAINT `degree of user` FOREIGN KEY (`degree_id`) REFERENCES `Degree` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Message`
	ADD CONSTRAINT `id user A` FOREIGN KEY (`userA`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `id user B` FOREIGN KEY (`userB`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Follow`
	ADD CONSTRAINT `person follow` FOREIGN KEY (`followers`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `person was followed` FOREIGN KEY (`tracked`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Editmessage` 
	ADD CONSTRAINT `fix message` FOREIGN KEY (`message_id`) REFERENCES `Message` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `who fix message` FOREIGN KEY (`whoedit`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Delconversation` 
	ADD CONSTRAINT `who want del` FOREIGN KEY (`whodel`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `who was del` FOREIGN KEY (`delwho`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;	

ALTER TABLE `Blockmessages` 
	ADD CONSTRAINT `who want block message` FOREIGN KEY (`whoblock`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `who was block message` FOREIGN KEY (`blockwho`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Checkmisspellings` 
	ADD CONSTRAINT `check with who` FOREIGN KEY (`checkwho`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `who want check` FOREIGN KEY (`whocheck`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Setting`
	ADD CONSTRAINT `id of user` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Post`
	ADD CONSTRAINT `iduserpost` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `title of post` FOREIGN KEY (`title_id`) REFERENCES `post_title` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Comment`
	ADD CONSTRAINT `id of post` FOREIGN KEY (`post_id`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `idusercomment` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Blocklist_user`
	ADD CONSTRAINT `who want block` FOREIGN KEY (`whoblock`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `who was block` FOREIGN KEY (`blockwho`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Blocklist_admin`
	ADD CONSTRAINT `block by admin` FOREIGN KEY (`blockwho`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Report_post_comment`
	ADD CONSTRAINT `who want report` FOREIGN KEY (`whoreport`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `who was report` FOREIGN KEY (`reportwho`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `type of report` FOREIGN KEY (`type`) REFERENCES `Type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `code report value` FOREIGN KEY (`code`) REFERENCES `Report_post_comment_content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Report_user`
	ADD CONSTRAINT `who want report1` FOREIGN KEY (`whoreport`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `who was report1` FOREIGN KEY (`reportwho`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `code report1 user` FOREIGN KEY (`code`) REFERENCES `Report_user_content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `likes_post`
	ADD CONSTRAINT `who like post` FOREIGN KEY (`id_user`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	ADD CONSTRAINT `which post` FOREIGN KEY (`id_post`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/* ############################################################################################### */

INSERT INTO `Language` (`name`, `symbol`) VALUES
('Vietnamese', 'vi'),
('French', 'fr'),
('German', 'de'),
('Italian', 'it'),
('Korean', 'ko'),
('Latin', 'lt'),
('English', 'en');


INSERT INTO `Type` (`code`, `content`) VALUES
('1000A', 'comment'),
('2000V', 'post'),
('5000F', 'message'),
('3001D', 'user');


INSERT INTO `Report_post_comment_content` (`code`, `content`) VALUES
('3DFLF', 'Reactionary content'),/* nội dung phản động */
('DDDDS', 'Pornographic content'), /* nội dung khiêu dâm */
('12SDA', 'Violent content'), /* nội dung bạo lực */
('VVCw1', 'Impolite content'),
('PD342', 'Harassment content'), /* nội dung quẫy rối */
('AA112', 'Offensive content'), /* nội dung phản cảm */
('GF334', 'Spam content');


INSERT INTO `Report_user_content` (`code`, `content`) VALUES 
/* report user */
('AS118', 'Bullying or harassment'),/* bắt nạt hoặc quẫy rối */
('MN2GH', 'Sexual violence and exploitation'),/* Bạo lực và bóc lột tình dục*/
('GG2DC', 'Impolite human'),
('DF334', 'deliberately provocative'); /* cố tình khiêu khích */


INSERT INTO `Level` (`level`, `score`) VALUES
(0, 0), (1, 1000), (2, 2000), (3, 3000), (4, 4000), (5, 5000),
(6, 6500), (7, 8000), (9, 9500), (10, 11000), (11, 12500),
(12, 14000), (13, 15500), (14, 17000), (15, 18500), (16, 20500),
(17, 22500), (18, 24500), (19, 26500), (20, 28500), (21, 30000),
(22, 33000), (23, 360000), (24, 39000), (25, 45000), (26, 48000),
(27, 52000), (28, 54000), (29, 58000), (30, 65000);


INSERT INTO `Degree`(`name`) VALUES 
('Beginner'),('Elementary'),('Intermediate'), ('Advanced'), ('Expert');

INSERT INTO `post_title`(`name`, `code`) VALUES 
('Grammar', '#FR4z'),('Vocabulary', 'A#vV2'),('Pronounce','DDH#m'), 
('Structure', 'H!zKK'), ('General', 'LAD&3');

