# Readify

**A full-featured e-commerce platform for buying and selling books — built to industry standards.**

> Developed and code-reviewed by industry experts.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [User Side](#user-side)
  - [Admin Side](#admin-side)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

**Readify** is a production-grade, server-side rendered e-commerce application for books. It supports a full shopping lifecycle — from browsing and wishlisting to checkout, payment, returns, and invoicing — with a powerful admin panel for store management and analytics.

The application follows the **MVC architecture**, uses **Google OAuth** for authentication, integrates **Razorpay** for payments, and is deployed on **AWS with Nginx**.

---

## Features

### User Side

**Authentication**
- Sign up / Sign in with email and password
- Google OAuth integration
- OTP-based email verification
- Forgot password and password reset flow
- Secure session handling

**Product Browsing**
- Browse, sort, and filter the book catalog
- Product detail page with image zoom, multiple images (3–4 per product), and related product suggestions
- Wishlist management

**Cart and Checkout**
- Add and remove products from cart, update quantities
- Apply coupons and category / product-level offers at checkout
- Three payment options: Razorpay, Cash on Delivery, and Wallet
- Retry failed Razorpay payments

**Orders**
- Place and track orders
- Cancel individual items or an entire order
- Request returns — refund credited to wallet
- Download invoice as PDF or Excel
- Full order history

**Wallet and Referrals**
- Internal wallet funded by refunds and referral rewards
- Unique referral code — earn rewards on successful friend sign-ups
- Wallet transaction history

**Profile**
- Manage multiple delivery addresses
- Upload profile image
- Update personal info and password

---

### Admin Side

**Access Control**
- Role-based admin login
- Secure admin-only middleware

**User Management**
- List all users
- Block and unblock accounts

**Product and Category Management**
- Add, update, and list products with Cloudinary image uploads
- Add and update categories
- Increase stock quantities

**Offers and Coupons**
- Full CRUD for product-level and category-level offers
- Coupon management: create, update, and set usage conditions

**Order Management**
- View all orders with full detail
- Update order statuses
- Handle return requests

**Dashboard and Reports**
- Sales dashboard with bar charts and pie charts powered by MongoDB Aggregation
- Filter reports by date range, product, or category
- Download sales reports as PDF or Excel

---

## Tech Stack

| Layer          | Technology                                     |
|----------------|------------------------------------------------|
| Runtime        | Node.js                                        |
| Framework      | Express.js                                     |
| View Engine    | EJS (Embedded JavaScript Templates)            |
| Database       | MongoDB with Mongoose                          |
| Architecture   | MVC                                            |
| Authentication | Passport.js, Google OAuth 2.0, express-session |
| Payments       | Razorpay                                       |
| Image Storage  | Cloudinary                                     |
| File Uploads   | Multer                                         |
| Email          | Nodemailer                                     |
| Charts         | Chart.js                                       |
| Deployment     | AWS EC2 + Nginx                                |

---

## Project Structure

```
readify/
├── config/                         # DB, Cloudinary, Passport, Razorpay config
├── controller/
│   ├── admin/                      # Admin controllers (dashboard, orders, products, etc.)
│   └── user/                       # User controllers (cart, checkout, orders, wallet, etc.)
├── helpers/
│   └── user/                       # Utility helpers (invoice, referral, status codes)
├── middlewares/
│   ├── admin/                      # Admin auth middleware
│   └── authMiddleware.js           # User auth middleware
├── models/
│   ├── admin/                      # Schemas: category, product, coupon, wishlist
│   └── user/                       # Schemas: user, order, address, wallet
├── router/
│   ├── adminRoutes.js
│   └── userRouter.js
├── validators/                     # Input validation (address, coupon, product)
├── views/
│   ├── admin/                      # Admin EJS views
│   ├── user/                       # User-facing EJS views
│   └── partials/                   # Shared header, footer, navbar, pagination
├── public/                         # Static assets (CSS, JS, images)
├── index.js                        # App entry point
└── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Cloudinary](https://cloudinary.com/) account
- [Razorpay](https://razorpay.com/) account
- Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/readify.git

# Navigate into the project directory
cd readify

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory and fill in the following values:

```env
PORT=3852

# Session
SESSION_SECRET=

# Nodemailer
NODEMAILER_EMAIL=
NODEMAILER_PASSWORD=
EMAIL_PASSWORD=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3852/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# MongoDB
MONGODB_URI=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# App
BASE_URL=http://localhost:3852
```

### Running the App

```bash
# Development (with auto-reload)
nodemon index

# Production
node index
```

The app will be available at `http://localhost:3852`.

---

## Deployment

Readify is deployed on **AWS EC2** with **Nginx** as a reverse proxy.

- Nginx handles incoming traffic and proxies requests to the Node.js process.
- Cloudinary manages all product image storage and delivery.
- PM2 is recommended for keeping the Node.js process alive in production.

---

## Contributing

Contributions are welcome. Feel free to fork the repository and open a pull request.

Built with love by **Sanukrishna PM**
