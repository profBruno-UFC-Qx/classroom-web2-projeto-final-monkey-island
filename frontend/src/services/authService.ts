import type { LoginCredentials, AuthResponse } from "@/types/auth";
import type { RegisterCredentials } from "@/types/auth";
import api from "@/api/api";

export default {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },
  async register(credentials: RegisterCredentials): Promise<void> {
    await api.post("/auth/register-user", credentials);
  },
  async registerAdmin(credentials: RegisterCredentials): Promise<void> {
    await api.post('/auth/register-admin', credentials);
  },
};
