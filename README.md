# TechKart India

A full-stack ecommerce web application for Indian electronics, built as a college project.
Customers can browse products, search and filter, add items to a cart, and check out. Admins
manage the product catalog and order pipeline through a dedicated dashboard.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Folder Structure](#folder-structure)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Screenshots](#screenshots)
8. [Installation Guide](#installation-guide)
9. [Default Admin Credentials](#default-admin-credentials)
10. [Future Improvements](#future-improvements)

---

## Project Overview

TechKart India is a two-tier web application: a React single-page frontend and an Express +
SQLite REST API backend, connected over HTTP with JWT-based authentication. It was scoped
deliberately to stay lean and fully working end-to-end rather than partially implementing a
larger feature set — there is **no image upload pipeline** (products use static placeholder
image URLs), **no real payment gateway** (checkout offers UPI / Card / COD as a UI-only
choice), **no email verification**, and **no cloud storage** — everything runs locally against
a single SQLite file.

## Features

**Customer**
- Home page: hero banner, featured products, shop-by-category grid, "why choose us", customer
  testimonials, newsletter signup
- Product listing with live search, category filter, and sorting (newest / price / rating)
- Product details: image gallery, specifications table, quantity selector, related products
- Shopping cart (persisted in `localStorage`): update quantity, remove items, running total
- Checkout: shipping address form with validation, UPI/Card/COD selection, order placement
- Order success page with order ID and summary
- Profile page with order history

**Authentication**
- Register, login, logout
- JWT issued on login/register, stored client-side, sent as a `Bearer` token
- Passwords hashed with bcrypt, never returned by the API
- Protected routes (checkout, profile, order confirmation) redirect to login if unauthenticated
- Session is restored on page refresh via `GET /api/auth/me`

**Admin**
- Separate admin login (`/admin/login`)
- Dashboard: total products, total orders, total users, total revenue
- Product management: add, edit, delete
- Order management: view all orders, update order status

## Technology Stack

**Frontend:** React 19 (Vite), Tailwind CSS v4, React Router v7, Axios
**Backend:** Node.js, Express 5 (MVC architecture), Helmet, CORS, Morgan
**Database:** SQLite via `better-sqlite3`
**Auth:** JSON Web Tokens (`jsonwebtoken`) + password hashing (`bcryptjs`)

## Folder Structure

```
college ecomm/
├── backend/
│   ├── server.js                # Entry point: loads env, DB, starts Express
│   ├── src/
│   │   ├── app.js               # Express app, middleware, route mounting
│   │   ├── config/env.js        # Centralized environment config (fails fast if misconfigured)
│   │   ├── controllers/         # auth, product, order, user request handlers
│   │   ├── models/               # SQL query layer (better-sqlite3 prepared statements)
│   │   ├── routes/                # Express routers per resource
│   │   ├── middleware/             # auth.middleware.js (JWT + admin guard), error.middleware.js
│   │   ├── database/
│   │   │   ├── db.js               # SQLite connection, applies schema.sql on boot
│   │   │   ├── schema.sql          # Table definitions
│   │   │   ├── seedData.js          # 27 realistic Indian electronics products
│   │   │   └── seed.js               # Idempotent seed runner (admin account + products)
│   │   └── utils/                     # jwt, password, slugify, ApiError, asyncHandler, constants
│   └── .env / .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/            # Navbar, Footer, Layout, AdminLayout
    │   │   ├── product/            # ProductCard, SearchBar, CategoryFilter, StockBadge
    │   │   ├── cart/                 # CartItem, CartSummary
    │   │   ├── admin/                 # AdminSidebar, StatsCard, ProductForm
    │   │   ├── home/                   # HeroBanner, CategoryGrid, WhyChooseUs, Testimonials, Newsletter
    │   │   └── common/                  # Button, Loader, EmptyState, ErrorPage, ProtectedRoute, AdminRoute
    │   ├── pages/
    │   │   ├── customer/          # Home, Products, ProductDetails, Cart, Checkout, OrderSuccess, Profile
    │   │   ├── auth/                # Login, Register
    │   │   └── admin/                # AdminLogin, Dashboard, ManageProducts, AddProduct, EditProduct, ManageOrders
    │   ├── context/                  # AuthContext, CartContext, ToastContext
    │   ├── hooks/                     # useAuth, useCart, useToast
    │   ├── services/                   # api.js (Axios instance) + authService, productService, orderService, userService
    │   ├── routes/AppRoutes.jsx          # Central route configuration
    │   └── utils/                          # formatCurrency.js, constants.js
    └── .env / .env.example
```

## Database Schema

SQLite database, auto-created at `backend/src/database/ecommerce.db` on first run (see
`backend/src/database/schema.sql`).

**users**
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| name | TEXT | |
| email | TEXT | UNIQUE |
| password | TEXT | bcrypt hash |
| phone | TEXT | optional |
| role | TEXT | `customer` \| `admin` |
| created_at | DATETIME | |

**products**
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| name, slug | TEXT | slug is UNIQUE |
| description, brand, category | TEXT | |
| price, mrp | REAL | selling price / list price |
| images | TEXT | JSON array of image URLs |
| specifications | TEXT | JSON object of key/value spec pairs |
| stock | INTEGER | |
| rating, num_reviews | REAL / INTEGER | |
| featured | INTEGER | 0/1, shown on home page |
| created_at, updated_at | DATETIME | |

**orders**
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| order_number | TEXT | UNIQUE, customer-facing id (e.g. `TK24007175756`) |
| user_id | INTEGER | FK → users |
| full_name, mobile, email, house_no, area, city, state, pincode | TEXT | shipping details |
| payment_method | TEXT | `UPI` \| `CARD` \| `COD` |
| status | TEXT | `Processing` \| `Shipped` \| `Delivered` \| `Cancelled` |
| total_amount | REAL | server-computed, never trusted from the client |
| created_at | DATETIME | |

**order_items**
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| order_id | INTEGER | FK → orders |
| product_id | INTEGER | FK → products (nullable, `ON DELETE SET NULL`) |
| product_name, product_image | TEXT | snapshot at time of order |
| price, quantity | REAL / INTEGER | |

Order totals and stock are always recomputed/re-validated server-side — the client only ever
sends `productId` + `quantity`, and stock is decremented atomically inside the order
transaction to prevent overselling under concurrent checkouts.

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth (`/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create a customer account → `{ user, token }` |
| POST | `/auth/login` | Public | Login → `{ user, token }` |
| POST | `/auth/logout` | Public | Stateless confirmation (client discards the token) |
| GET | `/auth/me` | Private | Current authenticated user |

### Products (`/products`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/products` | Public | List products. Query: `search, category, brand, minPrice, maxPrice, sort` |
| GET | `/products/featured` | Public | Featured products for the home page |
| GET | `/products/categories` | Public | Distinct categories with counts |
| GET | `/products/id/:id` | Admin | Look up a product by numeric id (used by the edit form) |
| GET | `/products/:slug` | Public | Single product + 4 related products |
| POST | `/products` | Admin | Create a product |
| PUT | `/products/:id` | Admin | Update a product |
| DELETE | `/products/:id` | Admin | Delete a product |

### Orders (`/orders`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/orders` | Private | Create an order from `{ shipping, paymentMethod, items }` |
| GET | `/orders/my` | Private | Orders placed by the logged-in user |
| GET | `/orders/:id` | Private | Single order (owner or admin only) |
| GET | `/orders` | Admin | All orders |
| PATCH | `/orders/:id/status` | Admin | Update order status |

### Users (`/users`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin | List all users |
| GET | `/users/stats` | Admin | `{ totalProducts, totalOrders, totalUsers, totalRevenue }` |

All private/admin routes require `Authorization: Bearer <token>`. Errors return
`{ "message": "..." }` with an appropriate HTTP status (400/401/403/404/409/500).

## Screenshots

_Add screenshots here before submission — suggested shots:_

| Page | File |
|---|---|
| Home page | `docs/screenshots/home.png` |
| Products page (with filters) | `docs/screenshots/products.png` |
| Product details | `docs/screenshots/product-details.png` |
| Cart | `docs/screenshots/cart.png` |
| Checkout | `docs/screenshots/checkout.png` |
| Order success | `docs/screenshots/order-success.png` |
| Admin dashboard | `docs/screenshots/admin-dashboard.png` |
| Admin — manage products | `docs/screenshots/admin-products.png` |
| Admin — manage orders | `docs/screenshots/admin-orders.png` |

Save images into `docs/screenshots/` and reference them here with
`![Home Page](docs/screenshots/home.png)`.

## Installation Guide

### Prerequisites
- Node.js 18+ and npm

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # defaults work out of the box for local dev
npm run seed               # creates the admin account + 27 seed products
npm run dev                 # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev                 # starts on http://localhost:5173
```

Open **http://localhost:5173**. The backend must be running on port 5000 (CORS is
pre-configured for `http://localhost:5173`).

### Environment Variables

**backend/.env**

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on |
| `NODE_ENV` | `development` or `production` |
| `DB_PATH` | Path to the SQLite database file |
| `JWT_SECRET` | Secret used to sign JWTs (required — the server refuses to start without it) |
| `JWT_EXPIRES_IN` | JWT expiry (e.g. `7d`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Bootstrap admin credentials used by `npm run seed` |
| `CLIENT_URL` | Frontend origin, used for CORS |

**frontend/.env**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

## Default Admin Credentials

Created automatically by `npm run seed` (from `backend/.env`):

```
Email:    admin@techkart.in
Password: Admin@123
```

Log in at **http://localhost:5173/admin/login**.

## Future Improvements

- Real payment gateway integration (Razorpay/Stripe) in place of the current UI-only selector
- Product image uploads (e.g. via multer + local disk or S3-compatible storage) instead of
  static URLs
- Email notifications (order confirmation, shipping updates) via a transactional email service
- Product reviews backed by the database instead of static home-page testimonials
- Wishlist / saved-for-later
- Pagination or infinite scroll on the products page (currently loads the full result set)
- Migrating from SQLite to a networked database (Postgres/MySQL) for multi-instance deployment
- Automated test suite (unit tests for controllers/models, integration tests for the API)
