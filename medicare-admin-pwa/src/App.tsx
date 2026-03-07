import { useState, useEffect } from 'react';
import type { User } from '@/types';
import { getCurrentUser, logout } from '@/services/authService';
import { initializeLocalStorage } from '@/services/dataset';
import { LoginForm } from '@/components/LoginForm';
import { Header } from '@/components/Header';
import { PerfilUsuario } from '@/components/PerfilUsuario';
import { Dashboard } from '@/pages/Dashboard';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    initializeLocalStorage();
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const handleUpdateUser = () => {
    const updatedUser = getCurrentUser();
    if (updatedUser) {
      setUser(updatedUser);
    }
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onLogout={handleLogout}
        onOpenProfile={() => setShowProfile(true)}
      />
      <Dashboard user={user} />
      {showProfile && (
        <PerfilUsuario
          user={user}
          onClose={() => setShowProfile(false)}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
}

export default App;

