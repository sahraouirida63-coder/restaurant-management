# 🍽️ Restaurant Management System

A full-stack **Restaurant POS & Management Platform** built with **Laravel 12** (REST API backend) and **React 19 + TypeScript** (SPA frontend). The system covers the complete restaurant workflow — from order placement to kitchen preparation, cashier billing, stock management and delivery tracking — through **7 dedicated role-based dashboards**.

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Architecture](#-architecture)
4. [Project Structure](#-project-structure)
5. [Database Schema](#-database-schema)
6. [API Reference](#-api-reference)
7. [Role-Based Access](#-role-based-access)
8. [User Roles & Dashboards](#-user-roles--dashboards)
9. [Authentication & Security](#-authentication--security)
10. [Installation & Setup](#-installation--setup)
11. [Environment Variables](#-environment-variables)
12. [Default Test Credentials](#-default-test-credentials)
13. [Frontend Components](#-frontend-components)
14. [Order Flow Lifecycle](#-order-flow-lifecycle)

---

## 📖 Project Overview

This system digitises all restaurant operations under one roof:

| Feature | Description |
|---|---|
| Role-based login | 7 roles, each redirected to their own dashboard |
| Order management | Waiters place orders; chefs prepare them |
| Real-time-style updates | Short-polling notifies waiters when orders are ready |
| Inventory control | Stock manager tracks ingredient quantities |
| Employee management | Manager/Owner can add, edit, delete staff |
| Menu management | Chef/Manager/Owner can CRUD menu items with images |
| Delivery tracking | Delivery agents update shipment statuses |
| Cashier billing | Cashier views ready orders and generates bills |

---

## 🛠 Tech Stack

### Backend — `laraveel/`
| Technology | Version | Purpose |
|---|---|---|
| PHP | ^8.2 | Runtime |
| Laravel | ^12.0 | MVC Framework |
| Laravel Sanctum | ^4.3 | API Token Authentication |
| MySQL | 8.x (XAMPP) | Relational Database |
| Laravel Tinker | ^2.10.1 | REPL / debugging |

### Frontend — `reeact/`
| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.4 | UI Library |
| TypeScript | ~5.9.3 | Type Safety |
| Vite | ^8.0.1 | Build Tool / Dev Server |
| React Router DOM | ^7.3.0 | Client-side Routing |
| Axios | ^1.6.1 | HTTP Client |
| Framer Motion | ^12.38.0 | Page & UI Animations |
| Recharts | ^2.10.0 | Charts / Analytics |
| Tailwind CSS | ^3.3.5 | Utility-first Styling |
| Heroicons | ^2.2.0 | Icon Library |
| Lucide React | ^0.263.1 | Icon Library |

---

## 🏗 Architecture

```
Browser (React SPA)
        │
        │  HTTP/JSON  (Bearer Token)
        ▼
Laravel REST API  ──► MySQL Database
  (port 8000)           (restaurant)
```

- The React SPA runs on **http://localhost:5173** (Vite dev server).
- All API calls go to **http://127.0.0.1:8000/api**.
- Authentication uses **Laravel Sanctum** token-based (stateless) auth.
- The token is stored in `localStorage` and injected via Axios interceptor.
- Route protection is enforced on **both** frontend (`ProtectedRoute`) and backend (`RoleMiddleware`).

---

## 📁 Project Structure

```
resturant/
├── laraveel/                    # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php       # Login / Logout / Current user
│   │   │   │   ├── Controller.php           # Base controller
│   │   │   │   ├── DeliveryController.php   # Delivery CRUD
│   │   │   │   ├── EmployeeController.php   # Employee + User CRUD
│   │   │   │   ├── MenuController.php       # Menu items + image upload
│   │   │   │   ├── OrderController.php      # Orders + order items
│   │   │   │   └── StockController.php      # Stock / inventory
│   │   │   └── Middleware/
│   │   │       ├── CorsMiddleware.php       # CORS headers
│   │   │       ├── OwnershipMiddleware.php  # Resource ownership check
│   │   │       └── RoleMiddleware.php       # Role-based gate
│   │   ├── Models/
│   │   │   ├── Delivery.php
│   │   │   ├── Employee.php
│   │   │   ├── Ingredient.php
│   │   │   ├── MenuItem.php
│   │   │   ├── Order.php
│   │   │   ├── OrderItem.php
│   │   │   ├── Payment.php
│   │   │   ├── Recipe.php
│   │   │   ├── Reservation.php
│   │   │   ├── Stock.php
│   │   │   ├── Table.php
│   │   │   └── User.php
│   │   └── Providers/
│   ├── database/
│   │   ├── migrations/          # 18 migration files
│   │   └── seeders/
│   │       ├── DatabaseSeeder.php
│   │       ├── EmployeeSeeder.php
│   │       ├── IngredientSeeder.php
│   │       ├── MenuItemSeeder.php
│   │       ├── OrderSeeder.php
│   │       ├── RecipeSeeder.php
│   │       ├── ReservationSeeder.php
│   │       ├── StockSeeder.php
│   │       ├── TableSeeder.php
│   │       └── UserSeeder.php
│   ├── routes/
│   │   └── api.php              # All API routes
│   ├── .env                     # Environment config
│   └── composer.json
│
├── reeact/                      # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.tsx        # Reusable button
│   │   │   ├── Layout.tsx        # App shell / sidebar
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Global auth state
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── OwnerDashboard.tsx
│   │   │   ├── ManagerDashboard.tsx
│   │   │   ├── WaiterDashboard.tsx
│   │   │   ├── ChefDashboard.tsx
│   │   │   ├── CashierDashboard.tsx
│   │   │   ├── StockDashboard.tsx
│   │   │   └── DeliveryDashboard.tsx
│   │   ├── services/
│   │   │   └── api.ts            # Axios API client (singleton)
│   │   ├── types/                # TypeScript interfaces
│   │   ├── App.tsx               # Router + AnimatePresence
│   │   ├── index.css             # Global styles (dark theme)
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── verify_menu.ps1              # PowerShell script to verify menu data
```

---

## 🗄 Database Schema

### Tables

| Table | Key Columns | Description |
|---|---|---|
| `users` | id, name, email, password, role | Login accounts for all roles |
| `employees` | id, name, email, role, phone, profile_image | Staff records |
| `menu_items` | id, name, price, category, description, image | Restaurant menu |
| `tables` | id, number, capacity | Physical dining tables |
| `orders` | id, table_id, waiter_id, status, total_price | Customer orders |
| `order_items` | id, order_id, menu_item_id, quantity | Line items per order |
| `reservations` | id, customer_name, date, time, guests, table_id | Table bookings |
| `recipes` | id, menu_item_id, ingredient_id, quantity | Menu-ingredient link |
| `ingredients` | id, name, unit, quantity_in_stock | Raw ingredients |
| `stock` | id, ingredient_id, quantity, reorder_level | Inventory tracking |
| `payments` | id, order_id, amount, method, status | Payment records |
| `deliveries` | id, order_id, address, status, driver_name | Delivery tracking |
| `personal_access_tokens` | (Sanctum) | API Bearer tokens |

### Order Status Flow

```
pending  ──►  preparing  ──►  ready  ──►  delivered / paid
  (Waiter)      (Chef)        (Chef)       (Waiter/Cashier)
```

---

## 📡 API Reference

Base URL: `http://127.0.0.1:8000/api`

### Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | `/login` | Authenticate and receive Bearer token |

### Protected Endpoints (require `Authorization: Bearer <token>`)

| Method | Endpoint | Roles | Description |
|---|---|---|---|
| POST | `/logout` | All | Revoke current token |
| GET | `/user` | All | Get current authenticated user |
| GET | `/orders` | All | List all orders (with items, table, waiter) |
| POST | `/orders` | All | Place a new order |
| PUT | `/orders/{id}` | All | Update order status |
| GET | `/employees` | manager, owner | List all employees |
| POST | `/employees` | manager, owner | Create employee + user account |
| PUT | `/employees/{id}` | manager, owner | Update employee |
| DELETE | `/employees/{id}` | manager, owner | Delete employee + user |
| GET | `/menu` | All | List menu items |
| GET | `/menu/{id}` | All | Get single menu item |
| POST | `/menu` | manager, owner, chef | Create menu item (supports image upload) |
| PUT | `/menu/{id}` | manager, owner, chef | Update menu item |
| DELETE | `/menu/{id}` | manager, owner, chef | Delete menu item |
| GET | `/stock` | stock, manager, owner | List inventory |
| POST | `/stock` | stock, manager, owner | Add stock entry |
| PUT | `/stock/{id}` | stock, manager, owner | Update quantity |
| GET | `/deliveries` | delivery, manager, owner | List deliveries |
| PATCH | `/deliveries/{id}/status` | delivery, manager, owner | Update delivery status |

---

## 🔐 Authentication & Security

1. **Laravel Sanctum** — stateless API token auth. On login, the backend generates a `personal_access_token` and returns it as plain text.
2. **Token storage** — stored in `localStorage`, attached to every request via Axios request interceptor.
3. **Role Middleware** (`RoleMiddleware.php`) — checks `user->role` against the required roles defined per route group.
4. **CORS Middleware** (`CorsMiddleware.php`) — permits requests from `localhost:5173` and `127.0.0.1:5173`.
5. **Frontend guard** (`ProtectedRoute.tsx`) — reads role from `AuthContext`; redirects unauthorized users to `/login`.
6. **Auto logout** — 401 responses on `/user` or `/login` endpoints automatically clear `localStorage` and redirect to login.

---

## 👥 User Roles & Dashboards

| Role | Route | Dashboard Features |
|---|---|---|
| **owner** | `/owner` | Full analytics, revenue overview, all KPIs |
| **manager** | `/manager` | Employee CRUD, menu CRUD, reservations, orders |
| **waiter** | `/waiter` | Place orders, view table status, receive "ready" notifications |
| **chef** | `/chef` | View pending/preparing orders, update status, menu management |
| **cashier** | `/cashier` | View ready orders, generate and print bills |
| **stock** | `/stock` | View/update ingredient inventory, low-stock alerts |
| **delivery** | `/delivery` | View assigned deliveries, update delivery status |

---

## 🎭 User Roles — Detailed

### Owner Dashboard (`/owner`)
- KPI cards: revenue, orders, staff count, menu items
- Revenue charts (Recharts)
- Read-only overview of entire operation

### Manager Dashboard (`/manager`)
- **Employee Management**: Add/Edit/Delete staff (creates both `employees` + `users` records)
- **Menu Management**: Full CRUD on menu items with image upload
- **Reservations**: View/manage table reservations
- **Order overview**: See all orders and their statuses

### Waiter Dashboard (`/waiter`)
- Browse menu and build an order per table (1–20)
- Submit order → sent to `POST /orders`
- Short-polling (`setInterval`) checks for orders in `ready` status → shows bell badge + notification banner
- Can mark orders as `delivered`

### Chef Dashboard (`/chef`)
- View all `pending` and `preparing` orders with full item details
- Update order status: `pending → preparing → ready`
- Can also manage menu items

### Cashier Dashboard (`/cashier`)
- Displays all `ready` orders
- Itemised bill with subtotals and grand total
- Mark order as `paid`

### Stock Dashboard (`/stock`)
- Lists all stock/ingredients with current quantity
- Add new entries or update quantities
- Visual low-stock warnings

### Delivery Dashboard (`/delivery`)
- Lists all deliveries with customer address and current status
- Update status: `pending → in_transit → delivered`

---

## 🔄 Order Flow Lifecycle

```
1. Waiter selects table + items  →  POST /orders  (status: pending)
2. Chef sees new order           →  PUT /orders/{id}  (status: preparing)
3. Chef finishes                 →  PUT /orders/{id}  (status: ready)
4. Waiter receives notification  →  Short-poll detects ready status
5. Waiter marks delivered        →  PUT /orders/{id}  (status: delivered)
6. Cashier views ready/delivered →  Generates bill  →  (status: paid)
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [XAMPP](https://www.apachefriends.org/) (PHP 8.2+, MySQL)
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/)

---

### 1. Clone / place the project
```
Place the project folder at: C:\xampp\htdocs\resturant\
```

### 2. Start XAMPP services
Start **Apache** and **MySQL** from the XAMPP Control Panel.

### 3. Create the Database
Open **phpMyAdmin** (`http://localhost/phpmyadmin`) and create a database named:
```
restaurant
```

### 4. Backend Setup
```bash
cd C:\xampp\htdocs\resturant\laraveel

# Install PHP dependencies
composer install

# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate

# Run all migrations
php artisan migrate

# Seed the database with test data
php artisan db:seed

# Link storage for image uploads
php artisan storage:link

# Start Laravel dev server
php artisan serve
```
Backend will be available at: **http://127.0.0.1:8000**

### 5. Frontend Setup
```bash
cd C:\xampp\htdocs\resturant\reeact

# Install JS dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend will be available at: **http://localhost:5173**

---

## 🌐 Environment Variables

### Backend (`laraveel/.env`)
```env
APP_NAME=Laravel
APP_ENV=local
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=restaurant
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
SANCTUM_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend (`reeact/.env`)
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

> The API base URL is currently hardcoded in `src/services/api.ts` as `http://127.0.0.1:8000/api`.

---

## 🔑 Default Test Credentials

All users share the same password: **`1234`**

| Role | Email |
|---|---|
| Owner | `reda@owner` |
| Manager | `reda@manager` |
| Waiter | `reda@waiter` |
| Chef | `reda@chef` |
| Cashier | `reda@cashier` |
| Stock Manager | `reda@stock` |
| Delivery Agent | `reda@delivery` |

> These are seeded by `UserSeeder.php`. Run `php artisan db:seed --class=UserSeeder` to re-seed.

---

## 🧩 Frontend Components

### `AuthContext.tsx`
Global authentication context providing:
- `user` — current user object (id, name, email, role)
- `isAuthenticated` — boolean
- `isLoading` — loading state during token validation
- `login(email, password)` — calls API and stores token
- `logout()` — clears token and redirects

### `Layout.tsx`
Persistent app shell containing:
- Responsive sidebar with role-aware navigation links
- Top header bar with user info and logout button
- Dark-theme SaaS aesthetic

### `ProtectedRoute.tsx`
HOC that:
1. Checks `isAuthenticated` — redirects to `/login` if false
2. Checks `user.role` against allowed `roles[]` prop — redirects if mismatch

### `api.ts` (APIClient class)
Singleton Axios wrapper with:
- Base URL configuration
- Request interceptor — injects `Authorization: Bearer <token>`
- Response interceptor — handles 401 auto-logout
- Methods: `login`, `logout`, `getCurrentUser`, `getOrders`, `createOrder`, `updateOrderStatus`, `getProducts`, `createProduct`, `updateProduct`, `deleteProduct`, `getStock`, `updateStock`, `getDeliveries`, `updateDeliveryStatus`, `getUsers`, `createUser`, `updateUser`, `deleteUser`

### `Button.tsx`
Reusable styled button with `variant` (primary, secondary, danger) and `size` (sm, md, lg) props.

### `LoadingSpinner.tsx`
Animated spinner with `size` prop (sm, md, lg).

---

## 🖼 Migrations Timeline

| Date | Migration |
|---|---|
| 2026-03-23 | employees, menu_items, tables, orders, order_items, reservations, recipes, ingredients, stock, payments, deliveries |
| 2026-03-24 | Update all user passwords (re-hash) |
| 2026-05-13 | Add `image` to menu_items; add `profile_image` to employees |

---

## 📦 Seeders

| Seeder | Data |
|---|---|
| `UserSeeder` | 7 role users (owner → delivery) |
| `EmployeeSeeder` | Sample staff records |
| `MenuItemSeeder` | Menu items per category |
| `TableSeeder` | Tables 1–20 |
| `OrderSeeder` | Sample orders |
| `IngredientSeeder` | Raw ingredients |
| `RecipeSeeder` | Menu–ingredient links |
| `StockSeeder` | Initial stock quantities |
| `ReservationSeeder` | Sample reservations |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is open-sourced under the [MIT License](https://opensource.org/licenses/MIT).

---

*Built with ❤️ using Laravel 12 + React 19 + TypeScript*
