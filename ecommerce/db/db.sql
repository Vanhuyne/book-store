-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ecommerce_db
-- ------------------------------------------------------
-- Server version	8.1.0

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
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `cart_item_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `quantity` int NOT NULL,
  `cart_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `FKpcttvuq4mxppo8sxggjtn5i2c` (`cart_id`),
  KEY `FK1re40cjegsfvw58xrkdp6bac6` (`product_id`),
  CONSTRAINT `FK1re40cjegsfvw58xrkdp6bac6` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=254 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `cart_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `UK_64t7ox312pqal3p7fg9o503c2` (`user_id`),
  CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (11,'2024-07-03 08:40:57.743670',13),(12,'2024-07-04 05:07:19.554041',3),(16,'2024-07-21 13:48:53.462454',16),(17,'2024-07-21 14:18:19.274247',18),(19,'2024-07-21 14:26:14.193988',19),(20,'2024-07-22 01:52:47.738162',4);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Fiction',NULL),(2,'Non-Fiction',NULL),(3,'Science Fiction',NULL),(4,'Mystery',NULL),(5,'Biography',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` bigint NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) DEFAULT NULL,
  `product_price` double DEFAULT NULL,
  `product_thumbnail_url` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (71,'Pearce Oysters',30,'product3.jpg',2,33),(72,'ProductNight Watch',40,'product4.jpg',1,34),(73,'Swift River: A Read with Jenna Pick',10,'product1.jpg',3,34),(74,'Authority',20,'product2.jpg',1,34),(75,'Pearce Oysters',30,'product3.jpg',1,34),(78,'The Measure of a Man',80,'product8.jpg',3,37),(79,'The Da Vinci Code',14.99,'thumnail-3.jpg',1,38),(80,'1984',9.99,'thumnail-2.jpg',1,38),(81,'Pearce Oysters',30,'product3.jpg',1,39),(82,'Pearce Oysters',30,'product3.jpg',1,40),(83,'ProductNight Watch',40,'product4.jpg',1,41),(103,'1984',9.99,'thumnail-2.jpg',4,32);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `shipping_city` varchar(255) DEFAULT NULL,
  `shipping_name` varchar(255) DEFAULT NULL,
  `shipping_postal_code` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `subtotal` double DEFAULT NULL,
  `tax` double DEFAULT NULL,
  `total` double DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `payment_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `UK_haujdjk1ohmeixjhnhslchrp1` (`payment_id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK8aol9f99s97mtyhij0tvfj41f` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (32,'2024-07-22 08:54:16.408132','38/2E Ấp Tam Đông,Xã Thới Tam Thôn, huyện Hóc Môn','Hồ Chí Minh','Thân Văn Huy','731050','Processing',39.96,4,43.96,'2024-07-28 08:51:31.028102',30,4),(33,'2024-07-22 15:32:02.832238','38/2E Ấp Tam Đông,Xã Thới Tam Thôn, huyện Hóc Môn','Hồ Chí Minh','Thân Văn Huy','731050','Pending',60,6,66,'2024-07-22 15:32:02.832238',31,4),(34,'2024-07-23 03:36:12.742660','38/2E Ấp Tam Đông,Xã Thới Tam Thôn, huyện Hóc Môn','Hồ Chí Minh','Thân Văn Huy','731050','Processing',120,12,132,'2024-07-23 03:36:12.742660',32,4),(37,'2024-07-23 03:48:42.162627','38/2E Ấp Tam Đông,Xã Thới Tam Thôn, huyện Hóc Môn','Hồ Chí Minh','Thân Văn Huy','731050','Processing',240,24,264,'2024-07-23 03:48:42.162627',35,4),(38,'2024-07-23 03:55:48.956749','38/2E Ấp Tam Đông,Xã Thới Tam Thôn, huyện Hóc Môn','Hồ Chí Minh','Thân Văn Huy','731050','Processing',24.98,2.5,27.48,'2024-07-23 03:55:48.956749',36,4),(39,'2024-07-23 04:21:28.153108','38/2E Ấp Tam Đông,Xã Thới Tam Thôn, huyện Hóc Môn','Hồ Chí Minh','Thân Văn Huy','731050','Pending',30,3,33,'2024-07-23 04:21:28.153108',37,4),(40,'2024-07-23 04:22:11.623590','38/2E Ấp Tam Đông,Xã Thới Tam Thôn, huyện Hóc Môn','Hồ Chí Minh','Thân Văn Huy','731050','Processing',30,3,33,'2024-07-23 04:22:11.623590',38,4),(41,'2024-07-23 04:40:21.108296','38/2E Ấp Tam Đông,Xã Thới Tam Thôn, huyện Hóc Môn','Hồ Chí Minh','Thân Văn Huy','731050','Pending',40,4,44,'2024-07-23 04:40:21.108296',39,4);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_token`
--

DROP TABLE IF EXISTS `password_reset_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_g0guo4k8krgpwuagos61oc06j` (`token`),
  UNIQUE KEY `UK_f90ivichjaokvmovxpnlm5nin` (`user_id`),
  CONSTRAINT `FK83nsrttkwkb6ym0anu051mtxn` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_token`
--

LOCK TABLES `password_reset_token` WRITE;
/*!40000 ALTER TABLE `password_reset_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `payment_time` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (3,152.867,'Pay After Delivery','Pending','2024-06-20 07:45:39.905000'),(4,152.867,'Pay After Delivery','Pending','2024-06-20 07:58:21.960000'),(5,141.867,'Pay After Delivery','Pending','2024-06-21 08:00:37.457000'),(6,82.42299999999999,'Pay After Delivery','Pending','2024-06-21 08:25:29.403000'),(7,10.989,'Pay After Delivery','Pending','2024-06-22 06:24:19.164000'),(8,27.478,'Pay After Delivery','Pending','2024-06-22 06:26:23.629000'),(9,136.378,'Pay After Delivery','Pending','2024-06-22 06:33:07.160000'),(10,425.634,'Pay After Delivery','Pending','2024-06-25 04:35:40.935000'),(11,200.134,'Pay After Delivery','Pending','2024-06-25 07:14:37.021000'),(12,275.97,'Pay After Delivery','Pending','2024-06-25 08:33:33.109000'),(13,21.98,'Pay After Delivery','Pending','2024-06-25 14:05:28.756000'),(14,27.48,'Pay After Delivery','Pending','2024-06-25 14:15:07.531000'),(15,21.98,'Pay After Delivery','Pending','2024-06-25 14:26:27.780000'),(16,33,'Pay After Delivery','Pending','2024-07-02 13:54:54.382000'),(17,147.38,'Pay After Delivery','Pending','2024-07-10 06:46:54.150000'),(18,566.5,'Pay After Delivery','Pending','2024-07-10 06:50:20.501000'),(19,372.7,'Pay After Delivery','Pending','2024-07-16 05:12:45.765000'),(20,136.38,'Pay After Delivery','Pending','2024-07-16 05:13:24.047000'),(21,16.49,'Pay After Delivery','Pending','2024-07-16 05:15:27.497000'),(22,10.99,'Pay After Delivery','Pending','2024-07-16 06:58:24.263000'),(23,10.99,'Pay After Delivery','Pending','2024-07-16 06:59:46.097000'),(24,150.67,'Pay After Delivery','Pending','2024-07-16 07:00:48.742000'),(25,14.29,'Pay After Delivery','Pending','2024-07-16 07:04:49.758000'),(26,210.02,'Pay After Delivery','Pending','2024-07-16 07:21:28.520000'),(27,180.34,'Pay After Delivery','Pending','2024-07-22 07:16:02.866000'),(30,43.96,'Stripe','Completed','2024-07-28 08:51:31.028000'),(31,66,'Pay After Delivery','Pending','2024-07-22 15:32:02.832000'),(32,132,'Stripe','Completed','2024-07-23 03:36:12.742000'),(35,264,'Stripe','Completed','2024-07-23 03:48:42.162000'),(36,27.48,'Stripe','Completed','2024-07-23 03:55:48.956000'),(37,33,'Pay After Delivery','Pending','2024-07-23 04:21:28.153000'),(38,33,'Stripe','Completed','2024-07-23 04:22:11.623000'),(39,44,'Pay After Delivery','Pending','2024-07-23 04:40:21.108000');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photos`
--

DROP TABLE IF EXISTS `photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photos` (
  `photo_id` bigint NOT NULL AUTO_INCREMENT,
  `url` varchar(255) DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`photo_id`),
  KEY `FKfqw85018828ukjdyp1kjbx4vm` (`product_id`),
  CONSTRAINT `FKfqw85018828ukjdyp1kjbx4vm` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photos`
--

LOCK TABLES `photos` WRITE;
/*!40000 ALTER TABLE `photos` DISABLE KEYS */;
INSERT INTO `photos` VALUES (1,'product2.jpg',1),(2,'product3.jpg',1),(3,'product4.jpg',1),(4,'product3.jpg',2),(5,'product3.jpg',2);
/*!40000 ALTER TABLE `photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double NOT NULL,
  `stock_quantity` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'2024-06-10 15:16:35.000000','A classic novel about racial injustice and moral growth in the American South.','To Kill a Mockingbird',12.99,95,'2024-07-23 08:05:14.157486',1,'thumnail-1.jpg'),(2,'2024-06-10 15:16:35.000000','A dystopian novel set in a totalitarian regime, exploring themes of surveillance and control.','1984',9.99,72,'2024-07-27 07:12:29.027066',3,'thumnail-2.jpg'),(3,'2024-06-10 15:16:35.000000','A thriller novel that follows symbologist Robert Langdon and cryptologist Sophie Neveu.','The Da Vinci Code',14.99,115,'2024-07-27 07:12:29.479894',4,'thumnail-3.jpg'),(9,'2024-06-28 14:15:08.226532','A Most Anticipated Book from Today, Real Simple, Time, Los Angeles Times, and BookPage','Swift River: A Read with Jenna Pick',10,97,'2024-07-23 08:29:18.666326',5,'product1.jpg'),(10,'2024-06-28 14:15:08.321532','In Authority, the New York Times bestselling second volume of Jeff VanderMeer\'s Southern Reach trilogy, Area X\'s most disturbing questions are answered . . . but the answers are far from reassuring.','Authority',20,98,'2024-07-27 07:48:14.523093',3,'product2.jpg'),(11,'2024-06-28 14:15:08.337533','A fractured family, a devastated community, and the disaster that brings them together.','Pearce Oysters',30,97,'2024-07-27 07:48:14.934875',3,'product3.jpg'),(12,'2024-06-28 14:15:08.348533','From one of our most accomplished novelists, a mesmerizing story about a mother and daughter seeking refuge in the chaotic aftermath of the Civil War--and a brilliant portrait of family endurance against all odds','ProductNight Watch',40,96,'2024-07-23 04:41:10.680103',5,'product4.jpg');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `rating_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `rating_value` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`rating_id`),
  KEY `FK228us4dg38ewge41gos8y761r` (`product_id`),
  KEY `FKb3354ee2xxvdrbyq9f42jdayd` (`user_id`),
  CONSTRAINT `FK228us4dg38ewge41gos8y761r` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `FKb3354ee2xxvdrbyq9f42jdayd` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `UK_ofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ROLE_ADMIN'),(2,'ROLE_USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`),
  CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (4,1),(4,2),(13,2),(16,2),(17,2),(18,2),(19,2),(20,2);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `profile_picture_url` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `status` enum('ACTIVE','DELETED','INACTIVE') DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'123 Main St','2024-06-15 19:12:48.000000','johndoe@example.com','John','Doe','password123','1234567890','http://example.com/profile.jpg','2024-06-15 19:12:48.000000','johndoe',NULL),(3,'456 Elm St','2024-07-01 04:34:32.272594','email@gmail.com','new1','Smith','$2a$10$cJFkUvhqYQ74/0zme46nhOZxo6cJliiddA4XwGVYHotdLQSTPsAJq','987654321','http://example.com/alice.jpg','2024-07-12 04:53:47.883085','username',NULL),(4,'38/2E Ấp Tam Đông,Xã Thới Tam Thôn, huyện Hóc Môn','2024-07-03 06:55:20.188981','thanvanhuyy@gmail.com','van','huy','$2a$10$YY2jiyatIYehbRkPkGjQ0.n.Dwdbd6RqlP4dbT2vOFe7Hy5kjqja.','123123123123','acddbd65-1a0d-4c8d-ba2e-a0bb52633d57.jpg','2024-07-23 04:48:10.561438','testuser1111',NULL),(13,NULL,'2024-07-03 08:40:04.063448','user@gmail.com','Thân','Huy','$2a$10$aPvuBA/AUBbuTsjEIHaPk.HrMtv2Plsnt23nvJNIMa/E7gsQSgpSm',NULL,NULL,'2024-07-03 08:40:04.063448','user123',NULL),(16,NULL,'2024-07-19 09:01:15.044234','huytvps26347@fpt.edu.vn','Than','Van Huy (FPL HCM)','$2a$10$Q8V7s7sKOdUA8MQYGY/GO.GMXQDcFz7sOxoTxTmu1JbtjFyNYEdtm',NULL,'d4a5c5bc-d54c-4338-ad67-436b96c9fc86.jpg','2024-07-19 09:01:15.044234','huytvps26347@fpt.edu.vn',NULL),(17,NULL,'2024-07-19 09:11:19.164140','thanvanhuy159@gmail.com','Than','Van Huy','$2a$10$ukTkHD.q6b37JN/Wx0YxOu32ybqJw10nbJyfBlgGawRQdEl1JYGW6',NULL,'https://lh3.googleusercontent.com/a/ACg8ocKfKdGUJZ29YXId8D7XOBT0yXGlbYNp5p3VdY9XR77T2QxaYw=s96-c','2024-07-19 09:11:19.164140','thanvanhuy159@gmail.com',NULL),(18,NULL,'2024-07-21 14:17:51.667547','thanvanhuy504@yahoo.com','vanhuy','than','$2a$10$X2cxVwf7jIbIJStjzYqswuFq4FVgnbAFtu362dvE1kqshwHastI0S',NULL,NULL,'2024-07-21 14:17:51.667547','vanhuy',NULL),(19,NULL,'2024-07-21 14:25:25.167238','vanhuy@gmail.com','Thân','Huy','$2a$10$XZ9BCunGCeZmu7ECMSrEXeBtr2Yn7QdqEXtRV.I/Mf/zN2iTBGwTS',NULL,NULL,'2024-07-21 14:25:25.167238','testuser',NULL),(20,NULL,'2024-07-21 14:27:09.504589','huytvps2634@fpt.edu.vn','van','teo','$2a$10$pW89fm/01Xa15G7qmM80QOKd8fc27iyDDTL2pxOJrVI9etdz3Gzz2',NULL,NULL,'2024-07-21 14:27:09.504589','user',NULL);
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

-- Dump completed on 2024-07-29 10:39:04
