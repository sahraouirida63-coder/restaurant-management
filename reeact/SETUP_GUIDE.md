# RestaurantPOS - Complete Setup Guide

## 🎯 Project Overview

This is a production-ready **Restaurant Management System** frontend built with React + Vite. It provides role-based dashboards for different restaurant staff members and integrates with a Laravel backend API.

## ✅ What's Been Created

### ✨ Frontend Features Completed

1. **Modern UI/UX**
   - Glass morphism cards with blur effects
   - Gradient backgrounds
   - Smooth animations and transitions
   - Responsive design (mobile, tablet, desktop)
   - Dark theme with orange accent colors

2. **Authentication System**
   - Login page with email/password
   - JWT token management
   - Session persistence
   - Automatic logout on 401 errors
   - Protected routes by role

3. **7 Role-Based Dashboards**
   - **Owner**: Revenue stats, charts, overview
   - **Manager**: Staff management, menu management
   - **Waiter**: POS system with menu & cart
   - **Chef**: Kitchen display with order statuses
   - **Cashier**: Billing system with payment methods
   - **Stock Manager**: Inventory with low stock alerts
   - **Delivery**: Delivery tracking with status updates

4. **Reusable Components**
   - Button component (variants: primary, secondary, outline, danger)
   - Loading spinner
   - Protected routes
   - Layout with sidebar navigation
   - Forms and inputs

5. **API Integration**
   - Axios client with interceptors
   - API service layer
   - Error handling
   - Type-safe endpoints

6. **Tech Stack**
   - React 19 with TypeScript
   - Vite build tool
   - Tailwind CSS
   - React Router DOM
   - Recharts for dashboards
   - Lucide React icons
   - Context API for auth

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Laravel backend at `http://127.0.0.1:8000`
- MySQL/database for Laravel

### Installation

```bash
# Navigate to the project
cd c:\xampp\htdocs\resturant\reeact

# Development server is already running on port 5173
# If you need to restart:
npm run dev
```

### Access the Application

Open your browser and go to: **http://localhost:5173**

You'll see the login page with a beautiful restaurant background image.

## 🔐 Backend Setup Requirements

For the application to work, you need a Laravel backend with the following:

### Database Tables

```sql
-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('owner','manager','waiter','chef','cashier','stock','delivery') NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    category VARCHAR(100),
    quantity_available INT DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    table_number INT,
    status ENUM('pending','confirmed','preparing','ready','delivered','cancelled') DEFAULT 'pending',
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Order Items table
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Stock table
CREATE TABLE stock (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    min_quantity INT DEFAULT 10,
    unit VARCHAR(50) DEFAULT 'pcs',
    last_updated TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Deliveries table
CREATE TABLE deliveries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    address VARCHAR(500) NOT NULL,
    status ENUM('pending','accepted','on_the_way','delivered') DEFAULT 'pending',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

### API Endpoints Required

The frontend expects the following API endpoints:

#### Authentication
```
POST /api/login
- Body: { email, password }
- Response: { user, token }

POST /api/logout

GET /api/user
- Response: User object
```

#### Users
```
GET /api/users
- Response: User[]

POST /api/users
- Body: User data

PUT /api/users/{id}
- Body: User data

DELETE /api/users/{id}
```

#### Products
```
GET /api/products
GET /api/products/{id}
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}
```

#### Orders
```
GET /api/orders
GET /api/orders/{id}
POST /api/orders
PUT /api/orders/{id}
PATCH /api/orders/{id}/status
- Body: { status }
```

#### Stock
```
GET /api/stock
PUT /api/stock/{id}
- Body: { quantity }
```

#### Deliveries
```
GET /api/deliveries
PATCH /api/deliveries/{id}/status
- Body: { status }
```

#### Dashboard
```
GET /api/dashboard/stats
- Response: { revenue, total_orders, total_products, active_deliveries }
```

## 📚 Available Roles

### 1. Owner (👑)
- Path: `/owner`
- Full restaurant overview
- Revenue analysis
- Charts and statistics
- Access to all data

### 2. Manager (👨‍💼)
- Path: `/manager`
- Staff management (CRUD)
- Menu management
- Employee scheduling

### 3. Waiter (🧑‍💼)
- Path: `/waiter`
- POS system
- Table selection
- Order placement
- Cart management

### 4. Chef (👨‍🍳)
- Path: `/chef`
- Kitchen display system
- Order management
- Status updates (pending → preparing → ready)

### 5. Cashier (💳)
- Path: `/cashier`
- Billing interface
- Payment processing
- Receipt generation

### 6. Stock Manager (📦)
- Path: `/stock`
- Inventory tracking
- Low stock alerts
- Reorder management

### 7. Delivery (🚚)
- Path: `/delivery`
- Delivery order tracking
- Status updates
- Customer information

## 🧪 Testing the Application

### Demo Credentials
```
Email: admin@restaurant.com
Password: password123
```

### Test User Setup
For testing, create test users in your Laravel database:

```php
// Seed file: database/seeders/UsersTableSeeder.php
User::create([
    'name' => 'Admin Owner',
    'email' => 'admin@restaurant.com',
    'password' => Hash::make('password123'),
    'role' => 'owner',
    'status' => 'active'
]);

User::create([
    'name' => 'Manager User',
    'email' => 'manager@restaurant.com',
    'password' => Hash::make('password123'),
    'role' => 'manager',
    'status' => 'active'
]);

// Continue for other roles...
```

## 🛠️ Development

### Project Structure

```
src/
├── pages/              # Page components (dashboards)
├── components/         # Reusable UI components
├── context/           # Auth context
├── services/          # API client
├── types/             # TypeScript interfaces
└── App.tsx            # Main app with routing
```

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Hot Module Replacement (HMR)

Changes are automatically reloaded in the browser during development. Just save your file and the browser will update instantly!

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize colors:
```javascript
theme: {
  extend: {
    colors: {
      primary: "#FF6B35",  // Change primary color
      secondary: "#004E89", // Change secondary color
    }
  }
}
```

### Styling
- Global styles: `src/index.css`
- Component styles: Tailwind classes inline
- No CSS files needed (all in Tailwind)

### Layout
- Main layout: `src/components/Layout.tsx`
- Sidebar styling and navigation
- Top bar and responsive design

## 📱 Responsive Design

The application is fully responsive:
- **Desktop**: Full sidebar + main content
- **Tablet**: Collapsible sidebar
- **Mobile**: Hamburger menu with overlay

## 🔒 Security Features

1. **JWT Authentication**
   - Tokens stored in localStorage
   - Sent in every API request header
   - Automatic refresh on expiry

2. **Protected Routes**
   - Role-based access control
   - Redirect unauthorized users to login

3. **Error Handling**
   - 401 redirects to login
   - Display meaningful error messages
   - Network error recovery

4. **CORS**
   - Configured for Laravel backend
   - Adjust backend CORS if needed

## 🚀 Deployment

### Production Build
```bash
npm run build
```

This creates a `dist/` folder ready for deployment.

### Deploy to Server
```bash
# Copy dist folder to your web server
# Point web server to dist/index.html for all routes
```

### Environment Configuration
Update `.env` for different environments:
```
VITE_API_BASE_URL=https://your-api.com/api
```

## 📊 Dashboard Features

### Owner Dashboard
- Revenue card with total
- Orders count
- Products count
- Active deliveries count
- Revenue trend chart (7 days)
- Orders by day chart
- Quick action buttons

### Manager Dashboard
- Tabbed interface (Employees / Menu)
- Employee table with CRUD
- Menu card grid
- Staff status display

### Waiter POS
- Table selection (20 tables)
- Menu item grid
- Add to cart
- Quantity management
- Order total
- Place order button

### Chef KDS
- Three column layout: Pending / Preparing / Ready
- Order cards with items
- Status change buttons
- Quick visual feedback

### Cashier Billing
- Pending orders list
- Selected order details
- Payment method selector
- Card payment simulator
- Complete payment button

### Stock Inventory
- Low stock alerts (red)
- Stock level indicators
- Progress bars
- Reorder suggestions

### Delivery Tracking
- Four columns: Pending / Accepted / On the Way / Delivered
- Customer details (name, phone, address)
- Status update buttons
- Delivery progress

## 🐛 Troubleshooting

### Issue: API Connection Errors
**Solution**: Ensure Laravel backend is running on `http://127.0.0.1:8000`

### Issue: CORS Errors
**Solution**: Add to Laravel backend's `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:5173'],
```

### Issue: Login Not Working
**Solution**: 
1. Check database has users with correct role
2. Verify password hashing matches Laravel
3. Check API response format matches expected type

### Issue: Styles Not Loading
**Solution**: Clear browser cache (Ctrl+Shift+Delete) and restart dev server

## 📞 Support

For questions or issues:
1. Check the API endpoints are correctly implemented
2. Verify database schema matches requirements
3. Check browser console for errors
4. Verify CORS configuration
5. Test API with Postman first

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📝 Next Steps

1. Set up Laravel backend with required endpoints
2. Create test users with different roles
3. Set up products and orders
4. Test each role's dashboard
5. Customize styling and branding
6. Deploy to production

---

**Built with ❤️ for modern restaurants**

Happy coding! 🚀
