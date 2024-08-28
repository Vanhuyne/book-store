--CREATE DATABASE IF NOT EXISTS ecommerce_db;
--USE ecommerce_db;

-- Disable foreign key checks temporarily to avoid issues with order of table creation
SET FOREIGN_KEY_CHECKS = 0;

-- Create tables
CREATE TABLE IF NOT EXISTS `cart_items` (
  `cart_item_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `quantity` int NOT NULL,
  `cart_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `FKpcttvuq4mxppo8sxggjtn5i2c` (`cart_id`),
  KEY `FK1re40cjegsfvw58xrkdp6bac6` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `carts` (
  `cart_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `UK_64t7ox312pqal3p7fg9o503c2` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `order_items` (
  `order_item_id` bigint NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) DEFAULT NULL,
  `product_price` double DEFAULT NULL,
  `product_thumbnail_url` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `orders` (
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
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `password_reset_token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_g0guo4k8krgpwuagos61oc06j` (`token`),
  UNIQUE KEY `UK_f90ivichjaokvmovxpnlm5nin` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `payments` (
  `payment_id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `payment_time` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `photos` (
  `photo_id` bigint NOT NULL AUTO_INCREMENT,
  `url` varchar(255) DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`photo_id`),
  KEY `FKfqw85018828ukjdyp1kjbx4vm` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `products` (
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
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `ratings` (
  `rating_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `rating_value` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`rating_id`),
  KEY `FK228us4dg38ewge41gos8y761r` (`product_id`),
  KEY `FKb3354ee2xxvdrbyq9f42jdayd` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `UK_ofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `users` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert data
INSERT INTO `cart_items` VALUES (256,'2024-08-24 03:40:25.823592',6,22,1),(258,'2024-08-24 04:02:35.009101',1,22,2),(261,'2024-08-24 07:24:52.068586',1,22,3);

INSERT INTO `carts` VALUES (22,'2024-08-24 03:35:01.450624',21);

INSERT INTO `categories` VALUES (1,'Fiction',NULL),(2,'Non-Fiction',NULL),(3,'Science Fiction',NULL),(4,'Mystery',NULL),(5,'Biography',NULL);

INSERT INTO `payments` VALUES (3,152.867,'Pay After Delivery','Pending','2024-06-20 07:45:39.905000'),(4,152.867,'Pay After Delivery','Pending','2024-06-20 07:58:21.960000'),(5,141.867,'Pay After Delivery','Pending','2024-06-21 08:00:37.457000'),(6,82.42299999999999,'Pay After Delivery','Pending','2024-06-21 08:25:29.403000'),(7,10.989,'Pay After Delivery','Pending','2024-06-22 06:24:19.164000'),(8,27.478,'Pay After Delivery','Pending','2024-06-22 06:26:23.629000'),(9,136.378,'Pay After Delivery','Pending','2024-06-22 06:33:07.160000'),(10,425.634,'Pay After Delivery','Pending','2024-06-25 04:35:40.935000'),(11,200.134,'Pay After Delivery','Pending','2024-06-25 07:14:37.021000'),(12,275.97,'Pay After Delivery','Pending','2024-06-25 08:33:33.109000'),(13,21.98,'Pay After Delivery','Pending','2024-06-25 14:05:28.756000'),(14,27.48,'Pay After Delivery','Pending','2024-06-25 14:15:07.531000'),(15,21.98,'Pay After Delivery','Pending','2024-06-25 14:26:27.780000'),(16,33,'Pay After Delivery','Pending','2024-07-02 13:54:54.382000'),(17,147.38,'Pay After Delivery','Pending','2024-07-10 06:46:54.150000'),(18,566.5,'Pay After Delivery','Pending','2024-07-10 06:50:20.501000'),(19,372.7,'Pay After Delivery','Pending','2024-07-16 05:12:45.765000'),(20,136.38,'Pay After Delivery','Pending','2024-07-16 05:13:24.047000'),(21,16.49,'Pay After Delivery','Pending','2024-07-16 05:15:27.497000'),(22,10.99,'Pay After Delivery','Pending','2024-07-16 06:58:24.263000'),(23,10.99,'Pay After Delivery','Pending','2024-07-16 06:59:46.097000'),(24,150.67,'Pay After Delivery','Pending','2024-07-16 07:00:48.742000'),(25,14.29,'Pay After Delivery','Pending','2024-07-16 07:04:49.758000'),(26,210.02,'Pay After Delivery','Pending','2024-07-16 07:21:28.520000'),(27,180.34,'Pay After Delivery','Pending','2024-07-22 07:16:02.866000'),(30,43.96,'Stripe','Completed','2024-07-28 08:51:31.028000'),(31,66,'Pay After Delivery','Pending','2024-07-22 15:32:02.832000'),(32,132,'Stripe','Completed','2024-07-23 03:36:12.742000'),(35,264,'Stripe','Completed','2024-07-23 03:48:42.162000'),(36,27.48,'Stripe','Completed','2024-07-23 03:55:48.956000'),(37,33,'Pay After Delivery','Pending','2024-07-23 04:21:28.153000'),(38,33,'Stripe','Completed','2024-07-23 04:22:11.623000'),(39,44,'Pay After Delivery','Pending','2024-07-23 04:40:21.108000');

INSERT INTO `photos` VALUES (1,'product2.jpg',1),(2,'product3.jpg',1),(3,'product4.jpg',1),(4,'product3.jpg',2),(5,'product3.jpg',2);

INSERT INTO `products` VALUES (1,'2024-06-10 15:16:35.000000','A classic novel about racial injustice and moral growth in the American South.','To Kill a Mockingbird',12.99,89,'2024-08-24 07:19:24.461459',1,'https://firebasestorage.googleapis.com/v0/b/commerce-4156e.appspot.com/o/images%2Fproducts%2F4e403899-3371-4649-aed8-303d8bceee0f.jpg?alt=media&token=ce753d2e-445a-4d72-b4f7-a2302f07a58a'),(2,'2024-06-10 15:16:35.000000','A dystopian novel set in a totalitarian regime, exploring themes of surveillance and control.','1984',9.99,71,'2024-08-24 04:02:35.009101',3,'https://firebasestorage.googleapis.com/v0/b/commerce-4156e.appspot.com/o/images%2Fproducts%2F66a11e2d-247a-405b-8b40-7fc8bc62ab69.jpg?alt=media&token=21080269-29c8-4273-be5f-20d83bb85646'),(3,'2024-06-10 15:16:35.000000','A thriller novel that follows symbologist Robert Langdon and cryptologist Sophie Neveu.','The Da Vinci Code',14.99,114,'2024-08-24 07:24:52.068586',4,'https://firebasestorage.googleapis.com/v0/b/commerce-4156e.appspot.com/o/images%2Fproducts%2F8763e55c-6337-45c3-90ce-8cc0960fcebd.jpg?alt=media&token=2b29a1b3-4275-4bd8-a1ec-0a9004de4ce9'),(9,'2024-06-28 14:15:08.226532','A Most Anticipated Book from Today, Real Simple, Time, Los Angeles Times, and BookPage','Swift River: A Read with Jenna Pick',10,97,'2024-08-24 04:02:36.281443',5,'https://firebasestorage.googleapis.com/v0/b/commerce-4156e.appspot.com/o/images%2Fproducts%2Fcdd4c20a-77d7-4275-b47a-240debf9afc4.jpg?alt=media&token=a6f41756-a2d9-4599-bc15-24c8958bd13f'),(10,'2024-06-28 14:15:08.321532','In Authority, the New York Times bestselling second volume of Jeff VanderMeer\'s Southern Reach trilogy, Area X\'s most disturbing questions are answered . . . but the answers are far from reassuring.','Authority',20,98,'2024-07-27 07:48:14.523093',3,'https://firebasestorage.googleapis.com/v0/b/commerce-4156e.appspot.com/o/images%2Fproducts%2Fd4ba8b7d-8a87-43f2-b7c7-69b7c7ae6b1e.jpg?alt=media&token=b0b27942-b212-40eb-89cd-06e72d06d2cf'),(52,'2024-08-24 03:47:29.244458','A dystopian novel set in a totalitarian regime, exploring themes of surveillance and control.','To Kill a Mockingbird',99,10,'2024-08-24 03:47:29.244458',1,'https://firebasestorage.googleapis.com/v0/b/commerce-4156e.appspot.com/o/images%2Fproducts%2Fc2fcf413-9576-4c4a-8729-35fb0193cb36.jpg?alt=media');
