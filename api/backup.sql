-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: okidoki
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `GalleryImage`
--

DROP TABLE IF EXISTS `GalleryImage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GalleryImage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `serviceId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `GalleryImage_serviceId_fkey` (`serviceId`),
  CONSTRAINT `GalleryImage_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GalleryImage`
--

LOCK TABLES `GalleryImage` WRITE;
/*!40000 ALTER TABLE `GalleryImage` DISABLE KEYS */;
INSERT INTO `GalleryImage` VALUES (1,'https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745354046/okidoki_media/pggndost32k1sllez6ex.jpg',1),(6,'https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745908481/1721236202261_wwhusy.jpg',1),(7,'https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745338272/okidoki_media/gnumotv2ndn3fxomzysf.jpg',1),(10,'https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745910557/Equipo_y_botargas_xraprb.jpg',4),(11,'https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745910560/Pandy_y_silla_gh7z5t.jpg',4),(14,'https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745910253/1694532195217_fzhxef.jpg',2),(15,'https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745910343/IMG_20220217_142533_fo5j9u.jpg',2),(16,'https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745911424/1722734555533_nljlrm.jpg',4),(17,'https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745911424/1722734555533_nljlrm.jpg',4);
/*!40000 ALTER TABLE `GalleryImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Service`
--

DROP TABLE IF EXISTS `Service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coverImage` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Service`
--

LOCK TABLES `Service` WRITE;
/*!40000 ALTER TABLE `Service` DISABLE KEYS */;
INSERT INTO `Service` VALUES (1,'Bob Esponja','Desde el fondo de bikini llego Bob Esponja a Costa Rica.','https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745338272/okidoki_media/gnumotv2ndn3fxomzysf.jpg','2025-04-20 06:19:02.770','2025-04-22 20:34:56.596',1),(2,'Super Mario y Luigi Bros','Llega desde el reino champiñon los hermanos Mario! ¿Podrán salvar a la princesa Peach de las garras de Bowser?','https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745357075/okidoki_media/x6446jx51m6ykptmsyeo.jpg','2025-04-22 21:20:26.050','2025-04-29 07:18:20.965',1),(3,'Payaso Plim Plim','Payaso Plim Plim','https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745358175/plim_plim_hbi9jz.jpg','2025-04-22 21:44:01.584','2025-04-30 04:18:22.287',1),(4,'Gigantes de OkiDoki','Gigantes de OkiDoki','https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745338276/okidoki_media/rumbcdyptknaxujuahm0.jpg','2025-04-22 21:45:10.378','2025-04-22 21:45:10.378',1),(5,'Paw Patrol','Chase, Skye y Bombero vienen para salvar el día, y a celebrar contigo','https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745338278/okidoki_media/phfmg8g6nxu3wcer6fsz.jpg','2025-04-22 21:48:05.306','2025-04-22 21:48:05.306',1),(6,'Los Minions','Los malvados Minions','https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745338275/okidoki_media/fieufegpilxopt3ujeyl.jpg','2025-04-22 21:52:06.093','2025-04-22 21:52:06.093',1),(7,'Mickey y Minnie Mouse','Desde Disney','https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745338274/okidoki_media/qiumqvuqcs13m10o2e7m.jpg','2025-04-22 21:53:55.950','2025-04-22 21:53:55.950',1),(8,'Spiderman','Los tres tipos de Spiderman, aquí en OkiDoki','https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745338279/okidoki_media/a8eq5sie2k2zgg1dxsv2.jpg','2025-04-22 21:55:22.260','2025-04-22 21:55:22.260',1),(9,'Star Wars','Darth Vader y los Stormtroopers de la Guerra de las Galaxias','https://res.cloudinary.com/fiestas-eventos-costarica-okidoki/image/upload/v1745896397/starwars_zviijd.jpg','2025-04-29 03:06:09.547','2025-04-29 03:22:59.556',1);
/*!40000 ALTER TABLE `Service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ServiceTag`
--

DROP TABLE IF EXISTS `ServiceTag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ServiceTag` (
  `serviceId` int NOT NULL,
  `tagId` int NOT NULL,
  PRIMARY KEY (`serviceId`,`tagId`),
  KEY `ServiceTag_tagId_fkey` (`tagId`),
  CONSTRAINT `ServiceTag_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ServiceTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ServiceTag`
--

LOCK TABLES `ServiceTag` WRITE;
/*!40000 ALTER TABLE `ServiceTag` DISABLE KEYS */;
INSERT INTO `ServiceTag` VALUES (8,1),(4,2),(5,2),(7,2),(2,4),(1,5),(3,5),(5,5),(7,5),(9,5),(2,6),(6,6),(8,6),(9,6);
/*!40000 ALTER TABLE `ServiceTag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tag`
--

DROP TABLE IF EXISTS `Tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tag_name_key` (`name`),
  UNIQUE KEY `Tag_slug_key` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tag`
--

LOCK TABLES `Tag` WRITE;
/*!40000 ALTER TABLE `Tag` DISABLE KEYS */;
INSERT INTO `Tag` VALUES (1,'Superhéroes','superhéroes'),(2,'Animales','animales'),(3,'Princesas','princesas'),(4,'Videojuegos','videojuegos'),(5,'Series de TV','series-de-tv'),(6,'Películas','películas');
/*!40000 ALTER TABLE `Tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Video`
--

DROP TABLE IF EXISTS `Video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Video` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `serviceId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Video_serviceId_fkey` (`serviceId`),
  CONSTRAINT `Video_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Video`
--

LOCK TABLES `Video` WRITE;
/*!40000 ALTER TABLE `Video` DISABLE KEYS */;
/*!40000 ALTER TABLE `Video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('9a31a558-85e6-4e5a-a64b-62c96044588f','26fb05540ecdf06ffc7819512479f6dcde699bd434efdb12ccbaf4b4c49a777c','2025-04-20 05:28:03.193','20250420052802_init',NULL,NULL,'2025-04-20 05:28:02.962',1),('a903b3fb-87e3-4751-8b72-f32eae964a4c','e613aa79f5c7d0b23c5a3a3007eefb9e02426f78130d5130037e76642e8512bb','2025-04-20 06:14:29.815','20250420061429_add_available_field',NULL,NULL,'2025-04-20 06:14:29.769',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-09 18:17:19
