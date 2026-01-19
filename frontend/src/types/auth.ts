export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  instituition: string; 
  bio?: string;       
}

export interface AuthResponse {
  jwt: string; 
}