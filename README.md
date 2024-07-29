# 🛒 E-commerce Project

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.6-brightgreen)
![Angular](https://img.shields.io/badge/Angular-Latest-red)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

A full-stack e-commerce solution built with Spring Boot, Angular, and MySQL.

## ✨ Features
- 🔐 User authentication and authorization
- 🔍 Product catalog with search and filter
- 🛒 Shopping cart management
- 📦 Order processing
- 💳 Secure payment integration
- 👤 User profile management
- 🛠️ Admin panel for product and order management
- 🔑 Login with Google using Firebase
- 💸 Payment processing with Stripe

## 📦 Installation
### Prerequisites
- Java Development Kit (JDK) 17+
- Node.js and npm
- MySQL Server
- Maven
- Angular CLI

### Backend Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/Vanhuyne/book-store.git
   cd ecommerce/ecommerce
   
2. Configure MySQL in `src/main/resources/application.properties`:
   ```bash
   spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password

3. Build the project:
   ```bash
   mvn clean install

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ecommerce/ecommerce-angular
2. Install dependencies:
   ```bash
   npm install

## 🚀 Quick Start

1. Start the backend:
   ```bash
   cd ecommerce
   mvn spring-boot:run
  . The server will start on `http://localhost:8080`.
  
2. Start the frontend:
   ```bash
   cd ecommerce-angular
   ng serve
  . The application will be available at `http://localhost:4200`.
  

## 📄 License

This project is licensed under the MIT License.





