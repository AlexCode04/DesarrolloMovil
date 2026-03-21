import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonToggle,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';

interface RouteParams {
  id?: string;
}

const TaskForm: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<RouteParams>();
  const { getTaskById, addTask, updateTask } = useTasks();

  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (id) {
      const task = getTaskById(id);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setDone(task.done);
      }
    }
  }, [id, getTaskById]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    if (isEditing && id) {
      updateTask(id, { title, description, done });
    } else {
      addTask({ title, description, done });
    }

    history.replace('/tasks');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{isEditing ? 'Editar tarea' : 'Nueva tarea'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Título</IonLabel>
              <IonInput
                value={title}
                onIonChange={(e) => setTitle(e.detail.value ?? '')}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Descripción</IonLabel>
              <IonTextarea
                value={description}
                onIonChange={(e) => setDescription(e.detail.value ?? '')}
                autoGrow
              />
            </IonItem>
            <IonItem>
              <IonLabel>Completada</IonLabel>
              <IonToggle
                checked={done}
                onIonChange={(e) => setDone(e.detail.checked)}
              />
            </IonItem>
          </IonList>

          <IonButton expand="block" type="submit" className="ion-margin-top">
            {isEditing ? 'Guardar cambios' : 'Crear tarea'}
          </IonButton>
          <IonButton
            expand="block"
            fill="clear"
            type="button"
            className="ion-margin-top"
            onClick={() => history.goBack()}
          >
            Cancelar
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default TaskForm;
