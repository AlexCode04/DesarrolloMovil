import { useState, useEffect } from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { getCurrentUser, logout } from '@/services/authService';
import { getVisitasByDate } from '@/services/visitaService';
import { initializeLocalStorage } from '@/services/dataset';
import { LoginPage } from '@/pages/LoginPage';
import { MainTabs } from '@/components/MainTabs';
import type { User } from '@/types';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [visitasPendientes, setVisitasPendientes] = useState(0);

  useEffect(() => {
    initializeLocalStorage();
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      actualizarBadge();
    }
  }, [user]);

  const actualizarBadge = () => {
    const hoy = new Date().toISOString().split('T')[0];
    const visitas = getVisitasByDate(hoy);
    const pendientes = visitas.filter(v => v.estado === 'pendiente').length;
    setVisitasPendientes(pendientes);
  };

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = '/login';
  };

  const handleUpdateUser = () => {
    const updatedUser = getCurrentUser();
    if (updatedUser) {
      setUser(updatedUser);
    }
  };

  return (
    <IonApp>
      <IonReactRouter>
        {!user ? (
          <IonRouterOutlet>
            <Route exact path="/login">
              <LoginPage onLogin={handleLogin} />
            </Route>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
          </IonRouterOutlet>
        ) : (
          <MainTabs
            user={user}
            visitasPendientes={visitasPendientes}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
          />
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
