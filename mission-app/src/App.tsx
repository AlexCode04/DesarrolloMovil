import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

// Ionic CSS
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Our theme
import './theme/global.css';

import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import HomePage from './pages/Home/HomePage';
import ResultsPage from './pages/Results/ResultsPage';
import { useAuth } from './hooks/useAuth';

setupIonicReact({ mode: 'md' });

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <div className="spinner-border" style={{ color: '#FF4D00', width: '2.5rem', height: '2.5rem' }} role="status"></div>
        </div>
      </div>
    );
  }

  return (
    <IonApp style={{ background: '#0A0A0F' }}>
      <IonReactRouter>
        <IonRouterOutlet>
          <Switch>
            <Route exact path="/login" render={() =>
              user ? <Redirect to="/home" /> : <LoginPage />
            } />
            <Route exact path="/register" render={() =>
              user ? <Redirect to="/home" /> : <RegisterPage />
            } />
            <Route exact path="/home" render={() =>
              user ? <HomePage user={user} /> : <Redirect to="/login" />
            } />
            <Route exact path="/results" render={() =>
              user ? <ResultsPage user={user} /> : <Redirect to="/login" />
            } />
            <Route exact path="/" render={() => <Redirect to={user ? '/home' : '/login'} />} />
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;