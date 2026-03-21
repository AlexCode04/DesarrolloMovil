import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';

const Tasks: React.FC = () => {
  const history = useHistory();
  const { tasks, deleteTask, updateTask } = useTasks();
  const { logout } = useAuth();

  const handleLogout = async () => {
  try {
    await logout();
  } finally {
    history.replace('/login');
  }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tareas</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>Logout</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={() => history.push('/tasks/new')} className="ion-margin-bottom">
          Nueva tarea
        </IonButton>

        <IonList>
          {tasks.map((task) => (
            <IonItem key={task.id} button onClick={() => history.push(`/tasks/${task.id}`)}>
              <IonLabel>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
              </IonLabel>
              <IonButtons slot="end">
                <IonButton
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTask(task.id, { done: !task.done });
                  }}
                >
                  {task.done ? 'Reabrir' : 'Completar'}
                </IonButton>
                <IonButton
                  color="medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push(`/tasks/edit/${task.id}`);
                  }}
                >
                  Editar
                </IonButton>
                <IonButton
                  color="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                >
                  Eliminar
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tasks;
