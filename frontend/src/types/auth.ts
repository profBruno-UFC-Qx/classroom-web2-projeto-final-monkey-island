import type { User } from './user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  institution: string; // Campo importante no seu User.ts
  bio?: string;       // Opcional no backend
}

export interface AuthResponse {
  token: string;
  user: User;
}