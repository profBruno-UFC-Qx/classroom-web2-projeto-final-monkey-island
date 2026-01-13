export interface User {
  id: string; 
  name: string;
  email: string;
  role: 'admin' | 'user' | 'researcher'; 
  institution?: string;
  bio?: string;
  status: 'active' | 'inactive' | 'banned';
}