import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { calendar, people, person } from 'ionicons/icons';
import { VisitasPage } from '@/pages/VisitasPage';
import { DetalleVisitaPage } from '@/pages/DetalleVisitaPage';
import { MisPacientesPage } from '@/pages/MisPacientesPage';
import { PerfilMedicoPage } from '@/pages/PerfilMedicoPage';
import type { User } from '@/types';

interface MainTabsProps {
  user: User;
  visitasPendientes: number;
  onLogout: () => void;
  onUpdateUser: () => void;
}

export function MainTabs({ user, visitasPendientes, onLogout, onUpdateUser }: MainTabsProps) {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/visitas">
          <VisitasPage />
        </Route>
        <Route path="/visitas/:id" render={() => <DetalleVisitaPage />} />
        <Route exact path="/pacientes">
          <MisPacientesPage />
        </Route>
        <Route exact path="/perfil">
          <PerfilMedicoPage user={user} onLogout={onLogout} onUpdateUser={onUpdateUser} />
        </Route>
        <Route>
          <Redirect to="/visitas" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="visitas" href="/visitas">
          <IonIcon icon={calendar} />
          <IonLabel>Visitas</IonLabel>
          {visitasPendientes > 0 && (
            <IonBadge color="danger">{visitasPendientes}</IonBadge>
          )}
        </IonTabButton>

        <IonTabButton tab="pacientes" href="/pacientes">
          <IonIcon icon={people} />
          <IonLabel>Pacientes</IonLabel>
        </IonTabButton>

        <IonTabButton tab="perfil" href="/perfil">
          <IonIcon icon={person} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
