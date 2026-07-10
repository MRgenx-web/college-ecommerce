# TechKart India

### An Electronics Ecommerce Web Application

**Project Report**

---

Submitted as part of a college project in Full-Stack Web Development

**Project Title:** TechKart India — Electronics Ecommerce Platform
**Technology Stack:** React, Node.js, Express, SQLite
**Domain:** Web Development / Ecommerce

---

<div style="page-break-after: always;"></div>

## Table of Contents

1. Abstract
2. Introduction
3. Objectives
4. Technologies Used
5. System Architecture
6. Database Design
7. Module Description
8. Screenshots
9. Testing
10. Future Scope
11. Conclusion

---

<div style="page-break-after: always;"></div>

## 1. Abstract

TechKart India is a full-stack ecommerce web application built to simulate a real-world
online electronics store operating in the Indian market. The system allows customers to
browse a catalog of electronics products across multiple categories, search and filter by
price and category, add items to a persistent shopping cart, and complete a checkout flow
that captures shipping details and a payment method preference. Registered users can view
their past orders, and a separate administrator role can manage the product catalog and
track/update order status through a dedicated admin dashboard.

The application follows a two-tier client-server architecture. The frontend is a React
single-page application built with Vite and styled with Tailwind CSS, communicating with a
Node.js/Express REST API over HTTP. The backend follows the Model-View-Controller (MVC)
pattern and persists data in a SQLite database, accessed through the `better-sqlite3` driver.
Authentication is implemented using JSON Web Tokens (JWT), with passwords hashed using
bcrypt before storage. The project deliberately excludes production-grade infrastructure that
would add complexity without adding to the core learning objectives of the assignment — there
is no real payment gateway, no file-upload pipeline for product images, and no third-party
email service. These are documented as future scope rather than left as unfinished, broken
features.

The result is a complete, working, and reasonably polished ecommerce application that
demonstrates the core competencies expected of a full-stack web development project:
relational data modeling, REST API design, authentication and authorization, client-side
state management, and responsive UI design.

---

## 2. Introduction

Ecommerce is one of the most common and instructive domains for a full-stack web development
project because it naturally requires almost every core skill in the discipline: relational
data modeling (products, users, orders), CRUD operations, authentication with role-based
access control, client-side state management (a shopping cart that persists across page
loads), form validation, and a responsive, presentable user interface.

TechKart India was built to be a realistic, India-focused electronics storefront — product
names, brands (Samsung, OnePlus, Xiaomi, Lenovo, HP, Dell, Logitech, JBL, boAt, Noise,
SanDisk, Anker), and prices are all modeled on real Indian retail conventions, with all
prices displayed in Indian Rupees (₹).

The project is split into two independently runnable applications that communicate over a
REST API:

- **`frontend/`** — a React 19 application built with Vite, using React Router for
  client-side routing, Axios for HTTP requests, and Tailwind CSS for styling.
- **`backend/`** — a Node.js/Express 5 application exposing a REST API, following an MVC
  folder structure (`controllers/`, `models/`, `routes/`, `middleware/`), backed by a SQLite
  database.

This separation mirrors how real-world web applications are typically structured, and allows
the two halves of the system to be developed, tested, and reasoned about independently.

---

## 3. Objectives

The primary objectives of this project were:

1. **Design and implement a relational database schema** capable of representing users,
   products, orders, and order line items, with appropriate foreign key relationships and
   constraints.
2. **Build a REST API** following MVC architecture, exposing endpoints for authentication,
   product catalog management, and order processing, with consistent error handling and
   input validation.
3. **Implement secure authentication** using JWT and bcrypt, including protected routes,
   role-based authorization (customer vs. admin), and session persistence across page
   refreshes.
4. **Build a complete customer-facing shopping experience**: browsing, searching, filtering,
   cart management, and checkout — without relying on stubbed or placeholder functionality
   for any of the customer-facing flows.
5. **Build a complete admin panel** allowing catalog and order management without direct
   database access.
6. **Produce a responsive, modern, and visually polished UI** using a component-based
   architecture with reusable UI primitives (buttons, cards, badges, loaders, empty states).
7. **Enforce server-side trust boundaries** — in particular, ensuring that order totals and
   stock levels are always computed and validated on the server, never trusted from the
   client, even though the client also performs its own validation for a responsive UX.
8. **Keep the implementation scoped and complete** rather than broad and unfinished —
   explicitly excluding features (payment gateways, image uploads, email delivery) that would
   add significant complexity without commensurate learning value for a college-level project.

---

## 4. Technologies Used

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Component-based UI library |
| Vite | Build tool and dev server |
| React Router v7 | Client-side routing, nested layouts, protected routes |
| Axios | HTTP client with request/response interceptors |
| Tailwind CSS v4 | Utility-first styling |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express 5 | HTTP server and routing framework |
| better-sqlite3 | Synchronous SQLite driver |
| jsonwebtoken | JWT signing and verification |
| bcryptjs | Password hashing |
| Helmet | Security-related HTTP headers |
| CORS | Cross-origin request control |
| Morgan | HTTP request logging |
| dotenv | Environment variable loading |
| nodemon | Development auto-restart |

### Tooling

| Technology | Purpose |
|---|---|
| npm | Package management |
| oxlint | Frontend linting |
| Git | Version control |

---

<div style="page-break-after: always;"></div>

## 5. System Architecture

TechKart India follows a classic **two-tier client-server architecture**, with a clear
separation between the presentation layer (React SPA) and the application/data layer
(Express API + SQLite).

```
┌─────────────────────────────┐          ┌──────────────────────────────────┐
│         FRONTEND             │          │             BACKEND               │
│      (React + Vite)          │          │        (Node.js + Express)        │
│                               │          │                                    │
│  ┌─────────────────────────┐  │          │  ┌──────────────────────────────┐  │
│  │  Pages (customer/auth/   │  │  HTTPS   │  │  Routes                       │  │
│  │  admin)                  │  │  REST    │  │  /api/auth  /api/products      │  │
│  ├─────────────────────────┤  │  (JSON)  │  │  /api/orders /api/users         │  │
│  │  Components (reusable    │◄─┼──────────┼─►├──────────────────────────────┤  │
│  │  UI: cards, forms, nav)  │  │  Axios   │  │  Middleware                    │  │
│  ├─────────────────────────┤  │          │  │  auth.middleware (JWT verify)   │  │
│  │  Context (Auth, Cart,    │  │          │  │  error.middleware (centralized) │  │
│  │  Toast) — client state   │  │          │  ├──────────────────────────────┤  │
│  ├─────────────────────────┤  │          │  │  Controllers                    │  │
│  │  Services (Axios calls)  │  │          │  │  auth / product / order / user  │  │
│  └─────────────────────────┘  │          │  ├──────────────────────────────┤  │
│                               │          │  │  Models (SQL query layer)       │  │
│                               │          │  └──────────────┬───────────────┘  │
└─────────────────────────────┘          └─────────────────┼──────────────────┘
                                                              ▼
                                                    ┌───────────────────┐
                                                    │  SQLite database   │
                                                    │  (ecommerce.db)    │
                                                    └───────────────────┘
```

### 5.1 Frontend Architecture

The frontend follows a layered component architecture:

- **`services/`** — a thin wrapper around Axios (`api.js`) that attaches the JWT to every
  outgoing request and normalizes error responses, plus one service module per REST resource
  (`authService`, `productService`, `orderService`, `userService`). No component talks to
  Axios directly; everything goes through a service function.
- **`context/`** — three React Context providers hold cross-cutting client state:
  `AuthContext` (current user, token, login/register/logout), `CartContext` (cart items,
  persisted to `localStorage`), and `ToastContext` (transient notifications).
- **`hooks/`** — thin custom hooks (`useAuth`, `useCart`, `useToast`) that wrap
  `useContext` and throw a clear error if used outside their provider.
- **`components/`** — organized by domain (`layout`, `product`, `cart`, `admin`, `home`,
  `common`) rather than by page, so a component like `ProductCard` can be reused across the
  home page, the product listing page, and the "related products" section.
- **`pages/`** — one file per route, composing components and services together. Pages
  contain data-fetching (`useEffect`) and page-specific state, but delegate presentation to
  components.
- **`routes/AppRoutes.jsx`** — a single file defining the entire route tree, including two
  route guards (`ProtectedRoute` for any authenticated user, `AdminRoute` for admin-only
  routes) and two layout shells (`Layout` for the customer site with navbar/footer,
  `AdminLayout` for the admin panel with a sidebar).

### 5.2 Backend Architecture (MVC)

The backend strictly separates concerns along MVC lines:

- **Routes** (`src/routes/`) define URL paths and HTTP methods, and declare which middleware
  (authentication, authorization) applies to each endpoint. Routes contain no business logic.
- **Controllers** (`src/controllers/`) parse and validate the request, call into the model
  layer, and shape the JSON response. All controllers are wrapped in an `asyncHandler` utility
  so that any thrown error (including from `await`ed model calls) is automatically forwarded
  to the centralized error-handling middleware instead of crashing the process.
- **Models** (`src/models/`) are the only layer that talks to the database. Each model
  exposes an async function per query (e.g. `productModel.findAll`,
  `orderModel.create`), using parameterized `better-sqlite3` prepared statements throughout —
  no raw string concatenation of user input into SQL, which eliminates SQL injection as an
  attack vector.
- **Middleware** (`src/middleware/`) implements cross-cutting concerns: `auth.middleware.js`
  verifies the JWT and attaches the authenticated user to `req.user` (`protect`), and
  restricts a route to admins (`adminOnly`); `error.middleware.js` is the single place where
  errors are turned into HTTP responses, including translating raw SQLite constraint errors
  into clean, generic 409 responses so internal schema details are never leaked to the client.

### 5.3 Authentication Flow

1. On register/login, the server verifies credentials (bcrypt-compares the password against
   the stored hash) and issues a JWT containing the user's `id` and `role`, signed with a
   server-side secret (`JWT_SECRET`).
2. The frontend stores the token in `localStorage` and attaches it as an
   `Authorization: Bearer <token>` header on every subsequent request via an Axios request
   interceptor.
3. On the backend, the `protect` middleware verifies the token's signature and expiry, then
   re-fetches the user from the database by the id embedded in the token — authorization
   decisions (e.g. `adminOnly`) are always made against the live database role, not a role
   claim cached inside the token, so a role change takes effect immediately rather than only
   after the old token expires.
4. On the frontend, `AuthContext` restores the session on page load by calling
   `GET /api/auth/me` if a token is present, so a page refresh does not log the user out.

### 5.4 Order & Stock Consistency

Order creation is the one place in the system where correctness under concurrency matters
most. The flow is:

1. The client sends only `{ productId, quantity }` pairs — never a price or a total.
2. The controller re-reads each product's current price and stock from the database and
   rejects the request if requested quantity exceeds available stock, computing the order
   total itself.
3. The order row, its line items, and the stock decrement are all performed inside a single
   SQLite transaction (`db.transaction(...)`).
4. The stock decrement uses an atomic conditional `UPDATE ... WHERE stock >= ?` rather than a
   plain decrement, so that if two customers attempt to buy the last unit of a product at
   nearly the same time, the second transaction's update affects zero rows and is rolled back
   with a clear "just sold out" error — closing the race-condition window between the
   controller's initial stock check and the actual write.

---

## 6. Database Design

The database is SQLite, chosen for its zero-configuration, file-based simplicity, which is
well suited to a single-instance college project (see [Future Scope](#10-future-scope) for
notes on migrating to a networked database for multi-instance deployments).

### 6.1 Entity-Relationship Overview

```
        ┌────────────┐            ┌────────────┐
        │   users     │            │  products   │
        ├────────────┤            ├────────────┤
        │ id (PK)     │            │ id (PK)     │
        │ name        │            │ name, slug  │
        │ email       │            │ description │
        │ password    │            │ brand       │
        │ phone       │            │ category    │
        │ role        │            │ price, mrp  │
        │ created_at  │            │ images(JSON)│
        └─────┬──────┘            │ specs (JSON) │
              │ 1                  │ stock        │
              │                    │ rating       │
              │ N                  │ featured     │
        ┌─────▼──────┐            └──────┬──────┘
        │   orders    │                    │ 1
        ├────────────┤                    │
        │ id (PK)     │                    │ N
        │ order_number│            ┌──────▼───────┐
        │ user_id(FK) │            │ order_items    │
        │ shipping *7  │◄──────────┤ id (PK)         │
        │ payment_method│  N     1 │ order_id (FK)    │
        │ status       │            │ product_id (FK) │
        │ total_amount │            │ product_name     │
        │ created_at   │            │ product_image     │
        └────────────┘            │ price, quantity    │
                                    └────────────────────┘
```

### 6.2 Table Definitions

**`users`** stores both customer and admin accounts in a single table, distinguished by a
`role` column constrained to `'customer'` or `'admin'` via a `CHECK` constraint. Passwords
are never stored in plain text — only a bcrypt hash.

**`products`** stores the catalog. Two columns — `images` and `specifications` — are stored
as serialized JSON text rather than normalized into separate tables. This was a deliberate
simplification: a product's specifications are a variable, category-dependent set of
key/value pairs (a laptop has "Processor"/"RAM"/"Storage"; a pair of earphones has "Battery
Life"/"Connectivity"), so a fixed relational schema would either need a generic
entity-attribute-value table (adding complexity disproportionate to the project's scope) or a
wide table with many nullable columns. JSON storage keeps the schema simple while still being
queryable for the fields that matter for filtering (`category`, `brand`, `price`).

**`orders`** captures a snapshot of the shipping address at the time of the order (rather than
a foreign key to a separate `addresses` table), since a real order's shipping address should
not silently change if the customer edits their profile later — this is the same reasoning
real ecommerce systems use.

**`order_items`** captures a snapshot of `product_name` and `product_image` at order time
(rather than only a foreign key to `products`), so that an order's history remains accurate
and displayable even if the referenced product is later edited or deleted by an admin
(`product_id` uses `ON DELETE SET NULL` rather than `CASCADE`, so deleting a product does not
delete historical orders that included it).

### 6.3 Indexing

Indexes are defined on `products.category`, `products.brand`, `orders.user_id`, and
`order_items.order_id` — the columns most frequently used in `WHERE` clauses for filtering
and for joining an order to its line items.

---

## 7. Module Description

| Module | Responsibility |
|---|---|
| **Auth module** | Registration, login, logout, session restoration, JWT issuance/verification |
| **Product module** | Catalog listing, search/filter/sort, product detail + related products, admin CRUD |
| **Cart module** | Client-side cart state, persisted in `localStorage`, quantity clamped to known stock |
| **Order module** | Order creation with server-side price/stock re-validation, order history, admin order management |
| **User/Admin module** | Dashboard statistics, user listing (admin only) |
| **UI/Common module** | Shared presentation primitives — buttons, loaders, empty states, toasts, route guards |

---

<div style="page-break-after: always;"></div>

## 8. Screenshots

_This section is a placeholder. Before final submission, run both servers locally, walk
through each flow below, and paste a screenshot under its heading._

### 8.1 Home Page
_(hero banner, featured products, category grid, testimonials)_

### 8.2 Product Listing Page
_(search, category filter, sort dropdown, product grid)_

### 8.3 Product Details Page
_(image gallery, price, specifications, related products)_

### 8.4 Shopping Cart

### 8.5 Checkout Page
_(shipping form, payment method selection)_

### 8.6 Order Success Page

### 8.7 Login / Register Pages

### 8.8 Admin Dashboard
_(stats cards: total products, orders, users, revenue)_

### 8.9 Admin — Manage Products

### 8.10 Admin — Manage Orders

---

## 9. Testing

Testing was performed manually and via scripted API checks (`curl` against the running
backend), covering both the happy path and deliberate negative/edge cases for each module.
No automated test suite (e.g. Jest) was included in this iteration — this is listed under
Future Scope.

### 9.1 Backend API Test Cases

| # | Test Case | Expected Result | Status |
|---|---|---|---|
| 1 | Register with valid data | 201, returns `{ user, token }` | Pass |
| 2 | Register with duplicate email | 409 Conflict | Pass |
| 3 | Register with invalid email format | 400 Bad Request | Pass |
| 4 | Register with password < 6 chars | 400 Bad Request | Pass |
| 5 | Login with correct credentials | 200, returns `{ user, token }` | Pass |
| 6 | Login with wrong password | 401 Unauthorized | Pass |
| 7 | Access `/auth/me` without token | 401 Unauthorized | Pass |
| 8 | Access `/auth/me` with valid token | 200, returns current user | Pass |
| 9 | List products with search/category/price filters | 200, filtered result set | Pass |
| 10 | Fetch single product by slug | 200, product + related products | Pass |
| 11 | Create product as non-admin | 403 Forbidden | Pass |
| 12 | Create product with invalid category | 400 Bad Request | Pass |
| 13 | Create product with `mrp` < `price` | 400 Bad Request | Pass |
| 14 | Create product with negative stock | 400 Bad Request | Pass |
| 15 | Update / delete product as admin | 200, product updated/deleted | Pass |
| 16 | Delete a non-existent product | 404 Not Found | Pass |
| 17 | Place an order with valid cart | 201, order created, stock decremented | Pass |
| 18 | Place an order exceeding available stock | 400 Bad Request | Pass |
| 19 | Place an order with an invalid 10-digit mobile/pincode | 400 Bad Request | Pass |
| 20 | View another customer's order | 403 Forbidden | Pass |
| 21 | View own order / admin views any order | 200 | Pass |
| 22 | Update order status as admin | 200, status updated | Pass |
| 23 | Update order status as customer | 403 Forbidden | Pass |
| 24 | Admin dashboard stats | 200, correct aggregate counts | Pass |
| 25 | CORS preflight from frontend origin | 204, correct `Access-Control-*` headers | Pass |

### 9.2 Frontend Testing

Each page was manually exercised for:

- **Functional correctness** — forms submit and validate correctly; cart quantity respects
  stock limits; protected routes redirect unauthenticated users to login and return them to
  their original destination after login; admin routes reject non-admin users.
- **Error handling** — API failures surface a visible message (toast or inline empty state)
  rather than failing silently; a product with no configured images falls back to a
  placeholder instead of a broken image icon.
- **Responsive layout** — verified at mobile, tablet, and desktop breakpoints using Tailwind's
  responsive utilities (`sm:`, `lg:`); the navbar collapses to a hamburger menu below the
  `md` breakpoint; product grids reflow from 4 columns down to 2.
- **Accessibility** — icon-only buttons (cart, quantity steppers, image gallery thumbnails)
  carry `aria-label`s; form inputs are associated with their `<label>` via matching
  `id`/`htmlFor`; toast notifications are announced via `aria-live="polite"`; focus is
  visible on all interactive elements via a global `:focus-visible` outline.

### 9.3 Known Limitations Identified During Testing

- Live in-browser automated testing could not be captured for this report (see the note in
  the Screenshots section) — testing was performed by directly exercising the running dev
  servers.
- There is no automated regression suite; re-testing after future changes is manual.

---

## 10. Future Scope

The following were consciously scoped out of this iteration to keep the project focused and
fully working, and are natural next steps:

1. **Real payment gateway integration** (e.g. Razorpay, which is the standard choice for an
   India-focused storefront) in place of the current UI-only UPI/Card/COD selector.
2. **Product image uploads** via an admin-facing upload flow (`multer` + local disk, or a
   cloud object store), replacing the current static placeholder-image-URL approach.
3. **Transactional email** (order confirmation, shipping/delivery updates, password reset)
   via a provider such as SendGrid or AWS SES.
4. **Database-backed product reviews**, replacing the static testimonials currently shown on
   the home page, tied to verified purchases.
5. **Wishlist / save-for-later** functionality.
6. **Pagination or infinite scroll** on the product listing page — the current
   implementation loads the full filtered result set in one request, which is adequate for a
   27-product demo catalog but would not scale to a production catalog size.
7. **Migration from SQLite to a networked RDBMS** (PostgreSQL or MySQL) to support multiple
   concurrent backend instances behind a load balancer, which a single-file SQLite database
   cannot do.
8. **Automated testing** — unit tests for controllers and models (e.g. with Jest and an
   in-memory SQLite database), and end-to-end tests for the critical checkout flow (e.g. with
   Playwright).
9. **Rate limiting** on authentication endpoints to mitigate brute-force login attempts.
10. **Deployment pipeline** — containerizing the backend and deploying the frontend as a
    static build to a CDN, with CI running the lint/build/test steps on every push.

---

## 11. Conclusion

TechKart India successfully demonstrates a complete, working ecommerce application built with
a modern JavaScript stack. It covers the full lifecycle of an online purchase — browsing,
searching, cart management, checkout, and order tracking — for the customer role, and full
catalog and order lifecycle management for the admin role, all backed by a properly normalized
relational schema and a REST API that enforces server-side validation and authorization at
every boundary.

The project prioritized **shipping a complete, correct, and polished system over a broader
but partially-implemented one**. Features like payment gateways, image uploads, and email
delivery were deliberately deferred rather than half-built, in line with the principle that a
small number of fully working features demonstrates stronger engineering judgment than a
larger number of unfinished ones. The resulting codebase is organized, documented, and
structured so that each of the deferred features listed in the Future Scope section could be
added incrementally without requiring a rewrite of the existing architecture.
