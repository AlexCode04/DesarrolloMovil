import { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonImg,
  IonButton,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/react';
import { getInitials, updateAvatar } from '@/services/authService';
import type { User } from '@/types';

interface PerfilMedicoPageProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: () => void;
}

export function PerfilMedicoPage({ user, onLogout, onUpdateUser }: PerfilMedicoPageProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(user.avatar);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        updateAvatar(result);
        onUpdateUser();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="flex flex-col items-center gap-4 py-6">
          <IonAvatar className="w-24 h-24">
            {previewUrl ? (
              <IonImg src={previewUrl} alt="Avatar" />
            ) : (
              <div className="w-full h-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                {getInitials(user.nombre, user.apellido)}
              </div>
            )}
          </IonAvatar>
          
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
          <IonButton size="small" onClick={() => document.getElementById('avatar-upload')?.click()}>
            Cambiar foto
          </IonButton>
        </div>

        <IonList>
          <IonItem>
            <IonLabel>
              <h3>Nombre</h3>
              <p>{user.nombre} {user.apellido}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h3>Email</h3>
              <p>{user.email}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h3>Rol</h3>
              <p className="capitalize">{user.rol}</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <div className="ion-padding">
          <IonButton expand="block" color="danger" onClick={onLogout}>
            Cerrar Sesión
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
