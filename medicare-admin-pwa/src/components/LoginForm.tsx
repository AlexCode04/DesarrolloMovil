import { useState } from 'react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { login } from '@/services/authService';
import type { User } from '@/types';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = login(email, password);
    if (user) {
      onLogin(user);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/medicare.png" alt="MediCare+ Logo" className="w-24 h-24 object-contain" />
          </div>
          <CardTitle>MediCare+ Admin</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@ejemplo.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
              />
            </div>
            {error && (
              <div className="text-sm text-destructive">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
