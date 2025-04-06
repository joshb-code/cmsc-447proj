-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: retriever_essential
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `items_table`
--

DROP TABLE IF EXISTS items_table;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE items_table (
  item_id int unsigned NOT NULL AUTO_INCREMENT,
  item_name varchar(255) DEFAULT NULL,
  item_description varchar(255) NOT NULL,
  type_id bigint NOT NULL,
  vendor_id int NOT NULL,
  quantity int DEFAULT NULL,
  price decimal(8,2) NOT NULL,
  weight decimal(8,2) DEFAULT NULL,
  PRIMARY KEY (item_id),
  KEY type_id (type_id),
  CONSTRAINT items_table_ibfk_1 FOREIGN KEY (type_id) REFERENCES type_table (type_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items_table`
--

LOCK TABLES items_table WRITE;
/*!40000 ALTER TABLE items_table DISABLE KEYS */;
/*!40000 ALTER TABLE items_table ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_table`
--

DROP TABLE IF EXISTS type_table;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE type_table (
  type_id bigint NOT NULL AUTO_INCREMENT,
  type_name varchar(255) NOT NULL,
  PRIMARY KEY (type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_table`
--

LOCK TABLES type_table WRITE;
/*!40000 ALTER TABLE type_table DISABLE KEYS */;
/*!40000 ALTER TABLE type_table ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_table`
--

DROP TABLE IF EXISTS user_table;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE user_table (
  user_id char(36) NOT NULL,
  firstname varchar(255) NOT NULL,
  lastname varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  `status` enum('admin','grad','undergrad') NOT NULL,
  phone varchar(20) NOT NULL,
  PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_table`
--

LOCK TABLES user_table WRITE;
/*!40000 ALTER TABLE user_table DISABLE KEYS */;
/*!40000 ALTER TABLE user_table ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_table`
--

DROP TABLE IF EXISTS vendor_table;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE vendor_table (
  vendor_id int NOT NULL AUTO_INCREMENT,
  vendor_name varchar(255) DEFAULT NULL,
  contact_name varchar(255) NOT NULL,
  address text NOT NULL,
  contact_phone varchar(20) NOT NULL,
  contact_email varchar(255) NOT NULL,
  PRIMARY KEY (vendor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_table`
--

LOCK TABLES vendor_table WRITE;
/*!40000 ALTER TABLE vendor_table DISABLE KEYS */;
/*!40000 ALTER TABLE vendor_table ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-05 23:04:12
