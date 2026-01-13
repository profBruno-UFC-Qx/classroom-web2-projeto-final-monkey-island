import api from "@/api/api";
import type { User } from "../types/user";

export default {
  async getMyProfile(): Promise<User> {
    // Chama a rota que já existe no backend
    const response = await api.get("/users/me");
    const data = response.data;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role, // Aqui virá 'researcher', 'admin' ou 'user'
      status: data.status,
      bio: data.bio,
      // Garante compatibilidade com erro de digitação comum no backend ou frontend
      institution: data.instituition || data.institution,
    } as User;
  },

  async getUserById(userId: string): Promise<User> {
    const response = await api.get(`/users/${userId}`);
    const data = response.data;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      bio: data.bio,
      institution: data.instituition || data.institution,
    } as User;
  },
};
