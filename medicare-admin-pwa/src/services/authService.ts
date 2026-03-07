import type { User } from '@/types';
import { USERS_MOCK } from './dataset';

export const login = (email: string, password: string): User | null => {
  const user = USERS_MOCK.find(
    u => u.email === email && u.password === password
  );
  
  if (user) {
    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as any).password;
    localStorage.setItem('medicare_user', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
  
  return null;
};

export const logout = (): void => {
  localStorage.removeItem('medicare_user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('medicare_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getInitials = (nombre: string, apellido: string): string => {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
};
