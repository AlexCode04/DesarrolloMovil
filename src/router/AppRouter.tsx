import React from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { IonRouterOutlet } from '@ionic/react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Tasks from '../pages/Tasks';
import TaskDetail from '../pages/TaskDetail';
import TaskForm from '../pages/TaskForm';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const { user, loading } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return null;
        }
        if (!user) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          );
        }
        return <Component {...props} />;
      }}
    />
  );
};

const AppRouter: React.FC = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login" component={Login} exact />
        <Route path="/register" component={Register} exact />

        <PrivateRoute path="/tasks" component={Tasks} exact />
        <PrivateRoute path="/tasks/new" component={TaskForm} exact />
        <PrivateRoute path="/tasks/edit/:id" component={TaskForm} exact />
        <PrivateRoute path="/tasks/:id" component={TaskDetail} exact />

        <Route path="/" exact render={() => <Redirect to="/login" />} />
        <Route render={() => <Redirect to="/login" />} />
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default AppRouter;
