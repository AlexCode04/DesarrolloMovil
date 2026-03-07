import { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonIcon, IonLoading, IonToast } from '@ionic/react';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { login } from '@/services/authService';
import type { User } from '@/types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleLogin = async () => {
    setShowLoading(true);
    
    setTimeout(() => {
      const user = login(email, password);
      setShowLoading(false);
      
      if (user) {
        onLogin(user);
      } else {
        setShowToast(true);
      }
    }, 1500);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="flex flex-col items-center justify-center min-h-full">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary">MediCare+</h1>
              <p className="text-muted-foreground mt-2">Visitas Médicas</p>
            </div>

            <div className="space-y-4">
              <IonInput
                type="email"
                label="Email"
                labelPlacement="floating"
                fill="outline"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
              />

              <div className="relative">
                <IonInput
                  type={showPassword ? 'text' : 'password'}
                  label="Contraseña"
                  labelPlacement="floating"
                  fill="outline"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value!)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                </button>
              </div>

              <IonButton
                expand="block"
                onClick={handleLogin}
                disabled={!email || !password}
              >
                Iniciar Sesión
              </IonButton>
            </div>

            <div className="text-sm text-center text-muted-foreground">
              <p>Credenciales de prueba:</p>
              <p>doctor@medicare.com / 123456</p>
            </div>
          </div>
        </div>

        <IonLoading
          isOpen={showLoading}
          message="Verificando credenciales..."
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Usuario o contraseña incorrectos"
          duration={3000}
          color="danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
}
