import { z } from "zod";

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/api" : "http://localhost:3000/api");

// API client wrapper
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem("bookify_token");
  }

  private saveToken(token: string) {
    this.token = token;
    localStorage.setItem("bookify_token", token);
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  setToken(token: string) {
    this.saveToken(token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("bookify_token");
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    // Unwrap backend's standard { success: true, data: ... } envelope
    if (json && typeof json === "object" && "data" in json) {
      return json.data as T;
    }
    return json as T;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return this.request<T>(endpoint + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

// Zod schemas (matching backend DTOs)
export const UserRoleEnum = z.enum(["CUSTOMER", "ADMIN"]);
export const OrderStatusEnum = z.enum([
  "PENDING",
  "PROCESSING", 
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
]);
export const NotificationTypeEnum = z.enum([
  "ORDER_PLACED",
  "ORDER_SHIPPED", 
  "ORDER_DELIVERED",
  "ORDER_CANCELLED",
  "LOW_STOCK_ALERT"
]);

// Auth schemas
export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  name: z.string().min(2).max(100),
  address: z.string().max(500).optional(),
  phone: z.string().max(20).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(6).max(100),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  address: z.string().max(500).nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
});

// Book schemas
export const CreateBookSchema = z.object({
  title: z.string().min(1).max(500),
  author: z.string().min(1).max(255),
  isbn: z.string().max(20).optional(),
  description: z.string().optional(),
  price: z.number().positive(),
  stockQuantity: z.number().int().min(0),
  categoryId: z.string().uuid().optional(),
  imageUrl: z.string().url().optional(),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
  publisher: z.string().max(255).optional(),
});

export const BookFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  author: z.string().optional(),
  publishedYear: z.coerce.number().int().optional(),
  inStock: z.coerce.boolean().optional(),
  sortBy: z.enum(["price_asc", "price_desc", "newest", "title"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

// Category schemas
export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
});

// Cart schemas
export const AddToCartSchema = z.object({
  bookId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

// Order schemas
export const CreateOrderSchema = z.object({
  shippingStreet: z.string().min(1).max(500),
  shippingCity: z.string().min(1).max(100),
  shippingState: z.string().min(1).max(100),
  shippingZipCode: z.string().min(1).max(20),
  shippingCountry: z.string().min(1).max(100),
  paymentMethod: z.string().default("SIMULATED"),
});

export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusEnum,
});

// Type exports
export type UserRole = z.infer<typeof UserRoleEnum>;
export type OrderStatus = z.infer<typeof OrderStatusEnum>;
export type NotificationType = z.infer<typeof NotificationTypeEnum>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
export type CreateBookDto = z.infer<typeof CreateBookSchema>;
export type UpdateBookDto = z.infer<typeof CreateBookSchema>;
export type BookFiltersDto = z.infer<typeof BookFiltersSchema>;
export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof CreateCategorySchema>;
export type AddToCartDto = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemDto = z.infer<typeof UpdateCartItemSchema>;
export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusSchema>;

// Create and export API client instance
export const apiClient = new ApiClient();
