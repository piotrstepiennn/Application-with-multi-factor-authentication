-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: portal_inz
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id_users` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(150) NOT NULL,
  `email` varchar(45) NOT NULL,
  `mobilepassword` varchar(45) NOT NULL,
  `authcode` varchar(45) NOT NULL DEFAULT '00000',
  `pin` varchar(45) DEFAULT '0000',
  `question` varchar(45) NOT NULL DEFAULT 'question',
  `answer` varchar(45) NOT NULL DEFAULT 'answer',
  PRIMARY KEY (`id_users`),
  UNIQUE KEY `idusers_UNIQUE` (`id_users`),
  UNIQUE KEY `user_name_UNIQUE` (`username`),
  UNIQUE KEY `user_email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (14,'piotr','haslo','ctd32879@zwoho.com','mobilnehaslo','70850',NULL,'question','answer'),(17,'marian','test','vej22496@cuoly.com','test2','70173',NULL,'question','answer'),(19,'tomek','$2b$10$eI/yW7HX6oSYwoaQl/r2ZeqsoWuEwGaa1qEpYIp.8Srrf9ZDWAH3m','zwo64077@boofx.com','test','34198',NULL,'question','answer'),(27,'test','$2b$10$vAAY8xrmkr/oMZkjzT2VhungYZh//jQD4XVS/gaY40KwIQ2PVu/PC','test@wp.pl','test','36747',NULL,'question','answer'),(37,'darkvod','$2b$10$cOQNiLCGokv8Nc7Bf/S67.Z0Jaix2OZFebz8Se5jmNVfWtfg1vQqG','piotr32123@o2.pl','test','13029','testowotestowo','game','hoi4'),(38,'asda','$2b$10$fNyeidXt35vPOtCab6/s7OMbk48jDxHd8lAivWUMHYxNVSf5fINkG','asd@wp.pl','aa','00000','asda','car','asd'),(39,'test1','$2b$10$N0PfihZkU0iMvJhzJTpLxOxTBR8fjup2z.bsGfrdg34azvko2wC26','trsdfs@wp.pl','test1','00000','test1test1','car','bmw');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-27 13:02:14
