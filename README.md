# 🛒 E-commerce NestJS Backend

<p align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo"/>
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/package/@nestjs/common" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://opencollective.com/nest/backers" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers"/></a>
  <a href="https://opencollective.com/nest/sponsors" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors"/></a>
</p>

---

## ⚡ Features

- 👤 **User Authentication**
  - Sign up / Sign in with **JWT**  
  - OAuth login (Google, Facebook) 🌐  
  - Role-based access control (Admin, User, Service Provider) 🔑

- 🛍️ **E-commerce Core**
  - Products management (CRUD) 📦  
  - Categories & subcategories 🏷️  
  - Shopping cart & checkout 🛒  
  - Coupons & discounts 💸  
  - Order tracking & status updates 📝

- 💳 **Payments**
  - Stripe integration for online payments 💳  
  - Cash on Delivery support 🏠  
  - Refund handling and stock adjustment 🔄

- 🗄️ **Database**
  - **MongoDB** with **Mongoose** ODM 🛢️  
  - Populated relations between users, orders, products ✅  

- 🔐 **Security**
  - Helmet for HTTP headers protection 🛡️  
  - Rate limiting with Throttler Guards ⏱️  
  - Input validation & sanitization ✅  

- 🧪 **Testing**
  - Unit tests and E2E tests 🧪  
  - Test coverage reports 📊  

- 🚀 **Deployment Ready**
  - Works with **NestJS Mau** for AWS deployment ☁️  
  - Configurable for **development, production, and watch mode** 👀  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | NestJS (TypeScript) |
| Database | MongoDB + Mongoose |
| Authentication | JWT, OAuth |
| Payment | Stripe |
| Testing | Jest (unit & e2e) |
| Security | Helmet, Throttler |
| Deployment | NestJS Mau, AWS |

---

## ⚙️ Project Setup

```bash
# Install dependencies
pnpm install
