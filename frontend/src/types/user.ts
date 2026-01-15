export type UserRole = 'admin' | 'user' | 'researcher';

export type UserStatus = 'active' | 'inactive' | 'banned';

export interface User {
  id: string; 
  name: string;
  email: string;
  role: UserRole; 
  institution?: string;
  bio?: string;
  status: UserStatus;
}