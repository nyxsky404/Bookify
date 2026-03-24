import { apiClient, LoginDto, RegisterDto } from "./api";

export type { LoginDto, RegisterDto };

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
  address?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export class AuthService {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    apiClient.setToken(response.token);
    return response;
  }

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", userData);
    apiClient.setToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    apiClient.clearToken();
  }

  async getCurrentUser(): Promise<AuthUser> {
    return apiClient.get<AuthUser>("/users/me");
  }

  async updateProfile(data: { name?: string; address?: string; phone?: string }): Promise<AuthUser> {
    return apiClient.patch<AuthUser>("/users/me", data);
  }

  async changePassword(data: { oldPassword: string; newPassword: string }): Promise<void> {
    await apiClient.patch("/users/me/password", data);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("bookify_token");
  }

  getToken(): string | null {
    return localStorage.getItem("bookify_token");
  }
}

export const authService = new AuthService();
