import api from "@/api/api";
import type { User } from "@/types/user";

function normalizeUser(data: any): User {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
    institution: data.institution || data.instituition || 'Não informada', 
  } as User;
}

export default {
  async getMyProfile(): Promise<User> {
    const response = await api.get("/users/me");
    return normalizeUser(response.data);
  },

  async getUserById(userId: string): Promise<User> {
    const response = await api.get(`/users/${userId}`);
    return normalizeUser(response.data);
  },

  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data.map(normalizeUser);
  },

  async banUser(id: string, reason: string): Promise<void> {
    await api.patch(`/users/${id}/ban`, { 
      reason: reason 
    });
  },
};