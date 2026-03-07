import type { User } from '@/types';
import { getInitials } from '@/services/authService';
import { Button } from '@/ui/button';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onOpenProfile: () => void;
}

export function Header({ user, onLogout, onOpenProfile }: HeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/medicare.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
          <div className="flex items-center gap-1 sm:gap-2">
            <h1 className="text-lg sm:text-2xl font-bold">MediCare+</h1>
            <span className="hidden sm:inline text-sm opacity-90">Administración</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden md:inline text-sm">{user.nombre} {user.apellido}</span>
          <button
            onClick={onOpenProfile}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity overflow-hidden flex-shrink-0"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary-foreground text-primary flex items-center justify-center text-xs sm:text-sm font-bold">
                {getInitials(user.nombre, user.apellido)}
              </div>
            )}
          </button>
          <Button variant="secondary" size="sm" onClick={onLogout} className="text-xs sm:text-sm px-2 sm:px-4">
            <span className="hidden sm:inline">Cerrar Sesión</span>
            <span className="sm:hidden">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
