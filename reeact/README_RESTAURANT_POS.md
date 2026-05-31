# RestaurantPOS - Restaurant Management System Frontend

A modern, production-ready React + Vite frontend for managing restaurants with role-based dashboards and real-time API integration.

## 🎯 Features

- **Multi-Role Support**: 7 different user roles with custom dashboards
- **Beautiful Modern UI**: Glass morphism, gradients, smooth animations
- **Real API Integration**: Connects to Laravel backend API
- **Authentication**: Email/password login with JWT tokens
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Role-Based Access Control**: Protected routes with role validation

## 🏗️ Project Structure

```
src/
├── pages/              # Page components for each role
│   ├── LoginPage.tsx
│   ├── OwnerDashboard.tsx
│   ├── ManagerDashboard.tsx
│   ├── WaiterDashboard.tsx
│   ├── ChefDashboard.tsx
│   ├── CashierDashboard.tsx
│   ├── StockDashboard.tsx
│   └── DeliveryDashboard.tsx
├── components/         # Reusable components
│   ├── Button.tsx
│   ├── LoadingSpinner.tsx
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
├── context/           # Auth context and providers
│   └── AuthContext.tsx
├── services/          # API client
│   └── api.ts
├── types/             # TypeScript types
│   └── index.ts
├── App.tsx            # Main app with routing
└── index.css          # Global styles with Tailwind
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Laravel backend running at `http://127.0.0.1:8000`

### Installation

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Start the development server:
```bash
npm run dev
```

3. Open browser at `http://localhost:5173`

### Environment Variables

Create a `.env` file:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## 👥 User Roles

### Owner 👑
- View dashboard with revenue, orders, and products stats
- Charts for revenue trends and orders
- Quick action buttons

### Manager 👨‍💼
- Manage employees (list, create, edit, delete)
- Menu management with product cards
- View staff status

### Waiter 🧑‍💼
- POS system with menu items
- Select table and add items to cart
- Manage quantities
- Place orders

### Chef 👨‍🍳
- Kitchen display system
- View pending, preparing, and ready orders
- Update order status
- Multiple order columns by status

### Cashier 🧑‍💼
- Billing screen
- Process payments
- Select payment method (cash, card, online)
- Complete order processing

### Stock Manager 📦
- View inventory levels
- Low stock alerts
- Stock progress bars
- Reorder notifications

### Delivery Partner 🚚
- View pending deliveries
- Track delivery status
- Update delivery progress
- Multi-column Kanban view

## 🔐 Authentication

### Login Flow

1. User enters email and password
2. API validates credentials against users table
3. Server returns user data and JWT token
4. Token stored in localStorage
5. User redirected based on their role

### Demo Credentials

```
Email: admin@restaurant.com
Password: password123
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **React Router DOM** - Routing
- **Axios** - API calls
- **Tailwind CSS** - Styling
- **Recharts** - Charts and graphs
- **Lucide React** - Icons
- **Context API** - State management

## 📡 API Integration

The project connects to the Laravel backend API at `http://127.0.0.1:8000/api`.

### Key Endpoints

- `POST /login` - User login
- `POST /logout` - User logout
- `GET /user` - Get current user
- `GET /users` - List all users
- `GET /products` - List products
- `GET /orders` - List orders
- `GET /stock` - Get inventory
- `GET /deliveries` - Get deliveries
- `GET /dashboard/stats` - Dashboard statistics

### API Client Features

- Automatic token injection in headers
- Error handling with 401 redirect
- Request/response interceptors
- Type-safe endpoints

## 🎨 Styling

The project uses:
- **Tailwind CSS** for utility-first styling
- **Glass morphism** effects (glass-dark class)
- **Custom animations** (fade-in, slide-in)
- **Color scheme**: Dark mode with orange accents

### Theme Colors

- Primary: `#FF6B35` (orange)
- Secondary: `#004E89` (blue)
- Dark: `#1a1a1a`
- Light: `#f5f5f5`

## 🔧 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📦 Dependencies

```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "axios": "^1.6.1",
  "react-router-dom": "^7.3.0",
  "recharts": "^2.10.0",
  "lucide-react": "^0.263.1",
  "tailwindcss": "^3.3.5"
}
```

## 🌐 API Response Examples

### Login Response
```json
{
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@restaurant.com",
    "role": "owner"
  },
  "token": "eyJhbGc..."
}
```

### Dashboard Stats
```json
{
  "revenue": 15000,
  "total_orders": 150,
  "total_products": 50,
  "active_deliveries": 5
}
```

## 🚨 Error Handling

- 401 errors redirect to login
- Error messages displayed in alerts
- Loading states for async operations
- Fallback UI for missing data

## 📱 Responsive Design

- Mobile-first approach
- Hamburger menu for mobile navigation
- Touch-friendly buttons and controls
- Adaptive grid layouts

## 🔒 Security

- JWT token authentication
- Protected routes by role
- Local storage for tokens
- Automatic logout on 401

## 💡 Future Enhancements

- Real-time order updates with WebSockets
- Push notifications
- Advanced reporting and analytics
- Multi-language support
- Dark/light theme toggle
- Invoice generation
- Customer loyalty programs

## 📝 License

This project is proprietary and confidential.

## 👥 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for modern restaurants**
