import type { User } from '@/types';

const STORAGE_KEY = 'medicare_mobile_user';

export const login = (email: string, password: string): User | null => {
  const users = [
    {
      id: '1',
      email: 'recepcion@medicare.com',
      password: '123456',
      nombre: 'María',
      apellido: 'González',
      rol: 'recepcionista' as const,
    },
    {
      id: '2',
      email: 'doctor@medicare.com',
      password: '123456',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      rol: 'medico' as const,
    },
    {
      id: '3',
      email: 'admin@medicare.com',
      password: '123456',
      nombre: 'Ana',
      apellido: 'Martínez',
      rol: 'admin' as const,
    },
  ];

  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
  return null;
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(STORAGE_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const getInitials = (nombre: string, apellido: string): string => {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
};

export const updateAvatar = (avatar: string): void => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    currentUser.avatar = avatar;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
  }
};
