# 🛒 E-commerce Project

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.6-brightgreen)
![Angular](https://img.shields.io/badge/Angular-Latest-red)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

A full-stack e-commerce solution built with Spring Boot, Angular, and MySQL.

## 📋 Table of Contents
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation](#-installation)
- [🚀 Quick Start](#-quick-start)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

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

## 🛠️ Tech Stack

- **Backend**: Spring Boot 3.2.6
- **Frontend**: Angular (latest version)
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA
- **Auth**: JWT (JSON Web Tokens)
- **Build Tool**: Maven

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
   ```

2. Configure MySQL in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Build the project:
   ```bash
   mvn clean install
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ecommerce/ecommerce-angular
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🚀 Quick Start

1. Start the backend:
   ```bash
   cd ecommerce
   mvn spring-boot:run
   ```
   The server will start on `http://localhost:8080`.

2. Start the frontend:
   ```bash
   cd ecommerce-angular
   ng serve
   ```
   The application will be available at `http://localhost:4200`.


## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

📧 For inquiries, please contact [Van Huy](mailto:thanvanhuyy@gmail.com).

⭐️ If you find this project useful, please consider giving it a star on GitHub!
