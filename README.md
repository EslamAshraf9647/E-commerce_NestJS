# 🛒 E-commerce NestJS Backend

<p align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" alt="Maintained" />
  <img src="https://img.shields.io/badge/Main%20Language-TypeScript-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Framework-NestJS-red.svg" alt="NestJS" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen.svg" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Payment-Stripe-purple.svg" alt="Stripe" />
</p>

---

## 📝 Description
A high-performance, modular E-commerce backend built with **NestJS**. This project demonstrates a deep understanding of software architecture, implementing real-world features like multi-level category management, secure payments with **Stripe**, real-time communication via **WebSockets**, and advanced caching using **Redis Cloud**.

---

## ⚡ Features

### 👤 User Authentication
* **JWT Auth:** Secure Sign up / Sign in with **JWT** 🔐.
* **OAuth Login:** OAuth login (Google, Facebook) 🌐.
* **RBAC:** Role-based access control (Admin, User, Service Provider) 🔑.

### 🛍️ E-commerce Core
* **Products Management:** Full CRUD operations for products 📦.
* **Categories:** Categories & subcategories management 🏷️.
* **Shopping Cart:** Shopping cart & checkout logic 🛒.
* **Promotions:** Coupons & discounts system 💸.
* **Order Management:** Order tracking & status updates 📝.

### 💳 Payments
* **Stripe Integration:** Stripe integration for online payments 💳.
* **Cash on Delivery:** Support for Cash on Delivery (COD) 🏠.
* **Refunds:** Refund handling and stock adjustment 🔄.

### 🗄️ Database & Performance
* **MongoDB:** MongoDB with **Mongoose** ODM 🛢️.
* **Relations:** Populated relations between users, orders, and products ✅.
* **Caching:** Advanced caching using **Redis Cloud** ⚡.

### 🔐 Security
* **Protection:** Helmet for HTTP headers protection 🛡️.
* **Rate Limiting:** Rate limiting with Throttler Guards ⏱️.
* **Validation:** Input validation & sanitization using DTOs ✅.

### 🧪 Testing & Deployment
* **Testing:** Unit tests and E2E tests 🧪.
* **Coverage:** Detailed test coverage reports 📊.
* **Deployment Ready:** Works with **NestJS Mau** for AWS deployment ☁️.
* **Environment:** Configurable for development, production, and watch mode 👀.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | NestJS (TypeScript) |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT, OAuth |
| **Payment** | Stripe |
| **Real-time** | Socket.io |
| **Testing** | Jest (unit & e2e) |
| **Security** | Helmet, Throttler |
| **Deployment** | NestJS Mau, AWS |

---

## 📂 Project Structure

```bash
src/
├── common/           # Decorators, Guards, Interceptors, Utilities
├── database/         # Mongoose Schemas and Connection
├── modules/          # Core Business Modules (User, Product, Order, etc.)
│   ├── services/     # Logic Layer (Business Logic)
│   ├── controllers/  # Routes Layer (API Endpoints)
│   └── repositories/ # Data Abstraction Layer (Database Access)
└── main.ts           # Application Entry Point

## ⚙️ Full Setup, Run, Test & Deployment Commands

```bash
# 1️⃣ Install dependencies
pnpm install

# 2️⃣ Compile and Run
# Development mode
pnpm run start
# Watch mode
pnpm run start:dev
# Production mode
pnpm run start:prod

# 3️⃣ Run Tests
# Unit tests
pnpm run test
# E2E tests
pnpm run test:e2e
# Test coverage
pnpm run test:cov

# 4️⃣ Deployment
# Install NestJS Mau globally
pnpm install -g @nestjs/mau
# Deploy to AWS
mau deploy
