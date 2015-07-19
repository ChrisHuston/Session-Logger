CREATE DATABASE  IF NOT EXISTS `session_logger` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `session_logger`;
-- MySQL dump 10.13  Distrib 5.6.24, for osx10.8 (x86_64)
--
-- Host: localhost    Database: session_logger
-- ------------------------------------------------------
-- Server version	5.5.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answer_data`
--

DROP TABLE IF EXISTS `answer_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answer_data` (
  `answer_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `module_id` int(10) unsigned NOT NULL,
  `user_id` varchar(24) NOT NULL,
  `drill_id` tinyint(3) unsigned NOT NULL,
  `question_id` tinyint(3) unsigned NOT NULL,
  `type_id` tinyint(3) unsigned NOT NULL,
  `answer_time` smallint(5) unsigned NOT NULL DEFAULT '0',
  `mistakes` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `used_answer` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `answer_txt` text NOT NULL,
  `answer_date` datetime NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `answer_score` float NOT NULL DEFAULT '0',
  `scored` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `choices` varchar(15) NOT NULL,
  `session_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`answer_id`),
  UNIQUE KEY `uniqueAnswer` (`module_id`,`user_id`,`drill_id`,`question_id`,`session_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `course_members`
--

DROP TABLE IF EXISTS `course_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_members` (
  `course_id` mediumint(9) unsigned NOT NULL,
  `net_id` varchar(10) NOT NULL,
  `section_id` mediumint(8) unsigned NOT NULL DEFAULT '1',
  `priv_level` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `seat_row` tinyint(2) NOT NULL DEFAULT '-1',
  `seat_col` tinyint(2) NOT NULL DEFAULT '-1',
  PRIMARY KEY (`course_id`,`net_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `course_sections`
--

DROP TABLE IF EXISTS `course_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_sections` (
  `course_id` mediumint(8) unsigned NOT NULL,
  `section` tinyint(3) unsigned NOT NULL,
  `room_id` smallint(5) unsigned NOT NULL,
  `section_id` int(10) unsigned NOT NULL,
  `alphabetic` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`course_id`,`section_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses` (
  `course_id` mediumint(8) unsigned NOT NULL,
  `course_name` varchar(128) NOT NULL,
  `show_attendance` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `show_cold_calls` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `show_participation` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `show_seating` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `enable_seating` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `show_quiz` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `k_course_id` mediumint(8) unsigned NOT NULL,
  `settings` text,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `credential_fields`
--

DROP TABLE IF EXISTS `credential_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `credential_fields` (
  `assignment_id` int(10) unsigned NOT NULL,
  `field_1` varchar(120) DEFAULT NULL,
  `field_2` varchar(120) DEFAULT NULL,
  `field_3` varchar(120) DEFAULT NULL,
  `field_4` varchar(120) DEFAULT NULL,
  `field_5` varchar(120) DEFAULT NULL,
  `field_6` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`assignment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `downloads`
--

DROP TABLE IF EXISTS `downloads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `downloads` (
  `download_id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(24) NOT NULL,
  `module_id` int(10) unsigned NOT NULL,
  `session_id` int(10) unsigned NOT NULL,
  `media_name` varchar(90) NOT NULL,
  `download_date` datetime NOT NULL,
  `ua` varchar(180) NOT NULL,
  PRIMARY KEY (`download_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `free_uploads`
--

DROP TABLE IF EXISTS `free_uploads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `free_uploads` (
  `user_id` varchar(24) NOT NULL,
  `module_id` int(10) unsigned NOT NULL,
  `drill_id` smallint(5) unsigned NOT NULL,
  `question_id` smallint(5) unsigned NOT NULL,
  `type_id` tinyint(1) unsigned NOT NULL,
  `file_name` varchar(120) NOT NULL,
  `session_id` int(8) unsigned NOT NULL,
  `upload_date` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`module_id`,`drill_id`,`question_id`,`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `media_views`
--

DROP TABLE IF EXISTS `media_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media_views` (
  `view_id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(24) NOT NULL,
  `view_seconds` mediumint(8) unsigned NOT NULL,
  `view_date` datetime NOT NULL,
  `media_name` varchar(45) NOT NULL,
  `module_id` int(10) unsigned NOT NULL,
  `canvas_course_id` int(10) unsigned NOT NULL,
  `session_id` int(10) unsigned NOT NULL,
  `ua` varchar(180) NOT NULL,
  PRIMARY KEY (`view_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `module_data`
--

DROP TABLE IF EXISTS `module_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `module_data` (
  `data_id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `module_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `user_id` varchar(24) NOT NULL DEFAULT '0',
  `percent_done` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `score` float unsigned NOT NULL DEFAULT '0',
  `module_time` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `last_date` datetime NOT NULL,
  `module_status` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `start_date` datetime NOT NULL,
  `retried` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `session_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`data_id`),
  UNIQUE KEY `unique_key` (`module_id`,`user_id`),
  KEY `user_key` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `session_data`
--

DROP TABLE IF EXISTS `session_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `session_data` (
  `session_id` int(10) unsigned NOT NULL,
  `net_id` varchar(10) NOT NULL,
  `present` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `excused` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `unexcused` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `late` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `cold_call` tinyint(1) NOT NULL DEFAULT '0',
  `comments` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `participation` decimal(4,1) NOT NULL DEFAULT '0.0',
  `flag` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `notes` text,
  PRIMARY KEY (`session_id`,`net_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `course_id` mediumint(8) unsigned NOT NULL,
  `section_id` mediumint(8) unsigned NOT NULL DEFAULT '1',
  `session_date` date NOT NULL,
  `module_id` mediumint(8) unsigned NOT NULL DEFAULT '0',
  `open_time` datetime NOT NULL DEFAULT '2012-12-12 12:00:00',
  `close_time` datetime NOT NULL DEFAULT '2012-12-12 12:00:00',
  PRIMARY KEY (`session_id`),
  UNIQUE KEY `uniqueSession` (`course_id`,`section_id`,`session_date`)
) ENGINE=InnoDB AUTO_INCREMENT=1124 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `net_id` varchar(10) NOT NULL,
  `user_name` varchar(128) NOT NULL,
  `user_img` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `nickname` varchar(45) DEFAULT NULL,
  `canvas_user_id` int(10) unsigned NOT NULL,
  `canvas_img` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`net_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-07-18 15:21:05
