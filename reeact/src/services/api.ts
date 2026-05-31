import axios, { AxiosError } from "axios";
import type { AxiosInstance } from "axios";
import type { LoginRequest, AuthResponse, User } from "../types";

const API_BASE_URL = "http://127.0.0.1:8000/api";

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Add request interceptor to include token
    this.client.interceptors.request.use((config: any) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response error handler
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: AxiosError<any>) => {
        const status = error.response?.status;
        const url = error.config?.url;

        // Only clear auth on 401 from auth endpoints or when token is invalid
        if (status === 401 && (url?.includes('/login') || url?.includes('/user'))) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>("/login", data);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>("/user");
    return response.data;
  }

  async validateToken(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Dashboard stats
  async getDashboardStats(): Promise<any> {
    
    return {
      totalRevenue: 45231.89,
      totalOrders: 2350,
      totalProducts: 122,
      totalUsers: 573,
      recentOrders: 145,
      lowStockItems: 12,
    };
  }

  // Users (for management screens)
  async getUsers(): Promise<User[]> {
    const response = await this.client.get<User[]>("/employees");
    return response.data;
  }

  async createUser(data: Partial<User>): Promise<User> {
    const response = await this.client.post<User>("/employees", data);
    return response.data;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await this.client.put<User>(`/employees/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.client.delete(`/employees/${id}`);
  }

  // Products (Menu)
  async getProducts(): Promise<any[]> {
    const response = await this.client.get("/menu");
    return response.data;
  }

  async getProduct(id: number): Promise<any> {
    const response = await this.client.get(`/menu/${id}`);
    return response.data;
  }

  async createProduct(data: FormData | any): Promise<any> {
    const isFormData = data instanceof FormData;
    const response = await this.client.post("/menu", data, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    });
    return response.data;
  }

  async updateProduct(id: number, data: any): Promise<any> {
    const response = await this.client.put(`/menu/${id}`, data);
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.client.delete(`/menu/${id}`);
  }

  // Orders
  async getOrders(): Promise<any[]> {
    const response = await this.client.get("/orders");
    return response.data;
  }

  async getOrder(id: number): Promise<any> {
    const response = await this.client.get(`/orders/${id}`);
    return response.data;
  }

  async createOrder(data: any): Promise<any> {
    const response = await this.client.post("/orders", data);
    return response.data;
  }

  async updateOrder(id: number, data: any): Promise<any> {
    const response = await this.client.put(`/orders/${id}`, data);
    return response.data;
  }

  async updateOrderStatus(id: number, status: string): Promise<any> {
    const response = await this.client.put(`/orders/${id}`, { status });
    return response.data;
  }

  // Stock/Inventory
  async getStock(): Promise<any[]> {
    const response = await this.client.get("/stock");
    return response.data.stocks || response.data; // Handle both formats
  }

  async createStock(data: any): Promise<any> {
    const response = await this.client.post("/stock", data);
    return response.data;
  }

  async updateStock(id: number, quantity: number): Promise<any> {
    const response = await this.client.put(`/stock/${id}`, { quantity });
    return response.data;
  }

  // Deliveries
  async getDeliveries(): Promise<any[]> {
    const response = await this.client.get("/deliveries");
    return response.data;
  }

  async updateDeliveryStatus(id: number, status: string): Promise<any> {
    const response = await this.client.patch(`/deliveries/${id}/status`, { status });
    return response.data;
  }
}

export const apiClient = new APIClient();
