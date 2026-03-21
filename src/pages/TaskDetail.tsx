import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonButton,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';

interface RouteParams {
  id: string;
}

const TaskDetail: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<RouteParams>();
  const { getTaskById } = useTasks();

  const task = getTaskById(id);

  if (!task) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Detalle</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonText color="danger">
            <p>Tarea no encontrada</p>
          </IonText>
          <IonButton expand="block" onClick={() => history.replace('/tasks')} className="ion-margin-top">
            Volver a la lista
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  const createdAt = new Date(task.createdAt).toLocaleString();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Detalle de tarea</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <p>
          Estado: <strong>{task.done ? 'Completada' : 'Pendiente'}</strong>
        </p>
        <p>Creada: {createdAt}</p>

        <IonButton expand="block" onClick={() => history.push(`/tasks/edit/${task.id}`)}>
          Editar
        </IonButton>
        <IonButton expand="block" fill="clear" onClick={() => history.push('/tasks')}>
          Volver a la lista
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default TaskDetail;
