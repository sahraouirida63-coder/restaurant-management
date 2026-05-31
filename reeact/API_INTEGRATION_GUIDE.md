# API Integration Guide - Laravel Backend

This guide explains the API endpoints that need to be implemented in the Laravel backend for the RestaurantPOS frontend to work correctly.

## 🎯 Base URL

```
http://127.0.0.1:8000/api
```

All examples assume this base URL.

## 🔐 Authentication

### 1. Login
**Endpoint**: `POST /api/login`

**Request**
```json
{
  "email": "admin@restaurant.com",
  "password": "password123"
}
```

**Response** (200)
```json
{
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@restaurant.com",
    "phone": "1234567890",
    "role": "owner",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error** (401)
```json
{
  "message": "Invalid credentials"
}
```

### 2. Logout
**Endpoint**: `POST /api/logout`

**Headers**
```
Authorization: Bearer {token}
```

**Response** (200)
```json
{
  "message": "Logged out successfully"
}
```

### 3. Get Current User
**Endpoint**: `GET /api/user`

**Headers**
```
Authorization: Bearer {token}
```

**Response** (200)
```json
{
  "id": 1,
  "name": "Admin",
  "email": "admin@restaurant.com",
  "phone": "1234567890",
  "role": "owner",
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 👥 Users Management

### 1. List Users
**Endpoint**: `GET /api/users`

**Headers**
```
Authorization: Bearer {token}
```

**Response** (200)
```json
[
  {
    "id": 1,
    "name": "Admin",
    "email": "admin@restaurant.com",
    "phone": "1234567890",
    "role": "owner",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "Manager",
    "email": "manager@restaurant.com",
    "phone": "0987654321",
    "role": "manager",
    "status": "active",
    "created_at": "2024-01-02T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
]
```

### 2. Create User
**Endpoint**: `POST /api/users`

**Headers**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "name": "New Employee",
  "email": "employee@restaurant.com",
  "password": "password123",
  "phone": "5555555555",
  "role": "waiter",
  "status": "active"
}
```

**Response** (201)
```json
{
  "id": 3,
  "name": "New Employee",
  "email": "employee@restaurant.com",
  "phone": "5555555555",
  "role": "waiter",
  "status": "active",
  "created_at": "2024-01-03T00:00:00Z",
  "updated_at": "2024-01-03T00:00:00Z"
}
```

### 3. Update User
**Endpoint**: `PUT /api/users/{id}`

**Headers**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "name": "Updated Name",
  "status": "inactive"
}
```

**Response** (200)
```json
{
  "id": 3,
  "name": "Updated Name",
  "email": "employee@restaurant.com",
  "phone": "5555555555",
  "role": "waiter",
  "status": "inactive",
  "created_at": "2024-01-03T00:00:00Z",
  "updated_at": "2024-01-03T12:00:00Z"
}
```

### 4. Delete User
**Endpoint**: `DELETE /api/users/{id}`

**Headers**
```
Authorization: Bearer {token}
```

**Response** (200)
```json
{
  "message": "User deleted successfully"
}
```

## 📦 Products Management

### 1. List Products
**Endpoint**: `GET /api/products`

**Response** (200)
```json
[
  {
    "id": 1,
    "name": "Caesar Salad",
    "description": "Fresh romaine lettuce with Caesar sauce",
    "price": 12.99,
    "image_url": "https://unsplash.com/photos/...",
    "category": "Salads",
    "quantity_available": 50,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "Grilled Salmon",
    "description": "Fresh Atlantic salmon with lemon butter",
    "price": 24.99,
    "image_url": "https://unsplash.com/photos/...",
    "category": "Main Courses",
    "quantity_available": 30,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### 2. Get Single Product
**Endpoint**: `GET /api/products/{id}`

**Response** (200)
```json
{
  "id": 1,
  "name": "Caesar Salad",
  "description": "Fresh romaine lettuce with Caesar sauce",
  "price": 12.99,
  "image_url": "https://unsplash.com/photos/...",
  "category": "Salads",
  "quantity_available": 50,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### 3. Create Product
**Endpoint**: `POST /api/products`

**Headers**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "name": "Pasta Carbonara",
  "description": "Classic Italian pasta with bacon and cream",
  "price": 16.99,
  "image_url": "https://unsplash.com/photos/...",
  "category": "Pasta",
  "quantity_available": 40
}
```

**Response** (201)
```json
{
  "id": 3,
  "name": "Pasta Carbonara",
  "description": "Classic Italian pasta with bacon and cream",
  "price": 16.99,
  "image_url": "https://unsplash.com/photos/...",
  "category": "Pasta",
  "quantity_available": 40,
  "created_at": "2024-01-03T00:00:00Z",
  "updated_at": "2024-01-03T00:00:00Z"
}
```

### 4. Update Product
**Endpoint**: `PUT /api/products/{id}`

**Headers**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "price": 17.99,
  "quantity_available": 35
}
```

**Response** (200)
```json
{
  "id": 3,
  "name": "Pasta Carbonara",
  "description": "Classic Italian pasta with bacon and cream",
  "price": 17.99,
  "image_url": "https://unsplash.com/photos/...",
  "category": "Pasta",
  "quantity_available": 35,
  "created_at": "2024-01-03T00:00:00Z",
  "updated_at": "2024-01-03T12:00:00Z"
}
```

### 5. Delete Product
**Endpoint**: `DELETE /api/products/{id}`

**Headers**
```
Authorization: Bearer {token}
```

**Response** (200)
```json
{
  "message": "Product deleted successfully"
}
```

## 🛒 Orders Management

### 1. List Orders
**Endpoint**: `GET /api/orders`

**Headers**
```
Authorization: Bearer {token}
```

**Response** (200)
```json
[
  {
    "id": 1,
    "table_number": 5,
    "status": "preparing",
    "total_price": 45.97,
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "quantity": 2,
        "price": 12.99,
        "notes": "Extra dressing on the side"
      },
      {
        "id": 2,
        "product_id": 2,
        "quantity": 1,
        "price": 24.99,
        "notes": "No lemon"
      }
    ],
    "created_at": "2024-01-03T10:00:00Z",
    "updated_at": "2024-01-03T10:15:00Z"
  }
]
```

### 2. Get Single Order
**Endpoint**: `GET /api/orders/{id}`

**Headers**
```
Authorization: Bearer {token}
```

**Response** (200)
```json
{
  "id": 1,
  "table_number": 5,
  "status": "preparing",
  "total_price": 45.97,
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 2,
      "price": 12.99,
      "notes": "Extra dressing on the side"
    }
  ],
  "created_at": "2024-01-03T10:00:00Z",
  "updated_at": "2024-01-03T10:15:00Z"
}
```

### 3. Create Order
**Endpoint**: `POST /api/orders`

**Headers**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "table_number": 7,
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 12.99,
      "notes": "Extra dressing on the side"
    },
    {
      "product_id": 2,
      "quantity": 1,
      "price": 24.99,
      "notes": "No lemon"
    }
  ]
}
```

**Response** (201)
```json
{
  "id": 2,
  "table_number": 7,
  "status": "pending",
  "total_price": 50.97,
  "items": [
    {
      "id": 3,
      "product_id": 1,
      "quantity": 2,
      "price": 12.99,
      "notes": "Extra dressing on the side"
    },
    {
      "id": 4,
      "product_id": 2,
      "quantity": 1,
      "price": 24.99,
      "notes": "No lemon"
    }
  ],
  "created_at": "2024-01-03T11:00:00Z",
  "updated_at": "2024-01-03T11:00:00Z"
}
```

### 4. Update Order
**Endpoint**: `PUT /api/orders/{id}`

**Headers**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "table_number": 8
}
```

**Response** (200)
```json
{
  "id": 2,
  "table_number": 8,
  "status": "pending",
  "total_price": 50.97,
  "items": [...],
  "created_at": "2024-01-03T11:00:00Z",
  "updated_at": "2024-01-03T11:05:00Z"
}
```

### 5. Update Order Status
**Endpoint**: `PATCH /api/orders/{id}/status`

**Headers**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "status": "ready"
}
```

**Valid Statuses**: `pending`, `confirmed`, `preparing`, `ready`, `delivered`, `cancelled`

**Response** (200)
```json
{
  "id": 1,
  "table_number": 5,
  "status": "ready",
  "total_price": 45.97,
  "items": [...],
  "created_at": "2024-01-03T10:00:00Z",
  "updated_at": "2024-01-03T10:30:00Z"
}
```

## 📦 Stock Management

### 1. List Stock Items
**Endpoint**: `GET /api/stock`

**Headers**
```
Authorization: Bearer {token}
```

**Response** (200)
```json
[
  {
    "id": 1,
    "product_id": 1,
    "product_name": "Caesar Salad",
    "quantity": 50,
    "min_quantity": 20,
    "unit": "pcs",
    "last_updated": "2024-01-03T09:00:00Z"
  },
  {
    "id": 2,
    "product_id": 2,
    "product_name": "Grilled Salmon",
    "quantity": 8,
    "min_quantity": 15,
    "unit": "pcs",
    "last_updated": "2024-01-03T08:30:00Z"
  }
]
```

### 2. Update Stock
**Endpoint**: `PUT /api/stock/{id}`

**Headers**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "quantity": 45
}
```

**Response** (200)
```json
{
  "id": 1,
  "product_id": 1,
  "product_name": "Caesar Salad",
  "quantity": 45,
  "min_quantity": 20,
  "unit": "pcs",
  "last_updated": "2024-01-03T12:00:00Z"
}
```

## 🚚 Deliveries Management

### 1. List Deliveries
**Endpoint**: `GET /api/deliveries`

**Headers**
```
Authorization: Bearer {token}
```

**Response** (200)
```json
[
  {
    "id": 1,
    "order_id": 1,
    "customer_name": "John Doe",
    "customer_phone": "555-1234",
    "address": "123 Main St, City, State 12345",
    "status": "on_the_way",
    "created_at": "2024-01-03T10:00:00Z",
    "updated_at": "2024-01-03T11:00:00Z"
  }
]
```

### 2. Update Delivery Status
**Endpoint**: `PATCH /api/deliveries/{id}/status`

**Headers**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**
```json
{
  "status": "delivered"
}
```

**Valid Statuses**: `pending`, `accepted`, `on_the_way`, `delivered`

**Response** (200)
```json
{
  "id": 1,
  "order_id": 1,
  "customer_name": "John Doe",
  "customer_phone": "555-1234",
  "address": "123 Main St, City, State 12345",
  "status": "delivered",
  "created_at": "2024-01-03T10:00:00Z",
  "updated_at": "2024-01-03T12:00:00Z"
}
```

## 📊 Dashboard Statistics

### Get Dashboard Stats
**Endpoint**: `GET /api/dashboard/stats`

**Headers**
```
Authorization: Bearer {token}
```

**Response** (200)
```json
{
  "revenue": 15000.50,
  "total_orders": 150,
  "total_products": 50,
  "active_deliveries": 5
}
```

## 📋 Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": {
    "email": ["The email field is required"]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthenticated"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "exception": "Exception message"
}
```

## 🔧 CORS Configuration

In Laravel `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

## 🔐 Authorization

Include the token in the Authorization header for all protected endpoints:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiI...
```

## ✅ Testing Checklist

- [ ] Login endpoint working
- [ ] Logout endpoint working
- [ ] Get current user working
- [ ] Users CRUD operations working
- [ ] Products CRUD operations working
- [ ] Orders CRUD operations working
- [ ] Order status updates working
- [ ] Stock retrieval and updates working
- [ ] Deliveries status updates working
- [ ] Dashboard stats endpoint working
- [ ] CORS properly configured
- [ ] Error messages returning proper format
- [ ] JWT tokens being validated
- [ ] Role-based access control (if needed)

---

**Ready to integrate with Laravel!** 🚀
