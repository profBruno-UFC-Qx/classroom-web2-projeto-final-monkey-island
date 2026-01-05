export interface User {
  id: string; // UUID é string
  name: string;
  email: string;
  role: 'admin' | 'user' | 'researcher'; // Adicionado para bater com o backend
  institution?: string;
  bio?: string;
  status: 'active' | 'inactive' | 'banned';
}