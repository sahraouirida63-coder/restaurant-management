export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "owner" | "manager" | "waiter" | "chef" | "cashier" | "stock" | "delivery";
  status?: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  quantity_available?: number;
  created_at?: string;
}

export interface Order {
  id: number;
  table_number?: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";
  items: OrderItem[];
  total_price: number;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Stock {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  min_quantity: number;
  unit: string;
  last_updated?: string;
}

export interface Delivery {
  id: number;
  order_id: number;
  customer_name: string;
  customer_phone: string;
  address: string;
  status: "pending" | "accepted" | "on_the_way" | "delivered";
  created_at?: string;
}

export interface Dashboard {
  revenue: number;
  total_orders: number;
  total_products: number;
  active_deliveries: number;
}
