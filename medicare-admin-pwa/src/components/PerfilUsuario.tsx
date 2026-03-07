import { useState } from 'react';
import type { User } from '@/types';
import { getInitials } from '@/services/authService';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';

interface PerfilUsuarioProps {
  user: User;
  onClose: () => void;
  onUpdate: () => void;
}

export function PerfilUsuario({ user, onClose, onUpdate }: PerfilUsuarioProps) {
  const [avatar, setAvatar] = useState<string | undefined>(user.avatar);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(user.avatar);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (avatar) {
      const currentUser = JSON.parse(localStorage.getItem('medicare_user') || '{}');
      currentUser.avatar = avatar;
      localStorage.setItem('medicare_user', JSON.stringify(currentUser));
      onUpdate();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                {getInitials(user.nombre, user.apellido)}
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nombre</p>
            <p className="font-medium">{user.nombre} {user.apellido}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rol</p>
            <p className="font-medium capitalize">{user.rol}</p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
