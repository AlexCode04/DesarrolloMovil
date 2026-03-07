import { useState, useEffect } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea
} from '@ionic/react';
import { getPacientes } from '@/services/pacienteService';
import { saveVisita } from '@/services/visitaService';
import type { Visita, Paciente } from '@/types';

interface FormularioVisitaProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: () => void;
  medicoId: string;
}

export function FormularioVisita({ isOpen, onClose, onGuardar, medicoId }: FormularioVisitaProps) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [formData, setFormData] = useState({
    pacienteId: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '',
    motivo: '',
    direccion: '',
    notas: ''
  });

  useEffect(() => {
    setPacientes(getPacientes());
  }, []);

  const handlePacienteChange = (pacienteId: string) => {
    setFormData({ ...formData, pacienteId });
    const paciente = pacientes.find(p => p.id === pacienteId);
    if (paciente) {
      setFormData(prev => ({ ...prev, pacienteId, direccion: paciente.direccion }));
    }
  };

  const handleSubmit = () => {
    if (!formData.pacienteId || !formData.fecha || !formData.hora || !formData.motivo) {
      return;
    }

    const nuevaVisita: Visita = {
      id: Date.now().toString(),
      pacienteId: formData.pacienteId,
      medicoId,
      fecha: formData.fecha,
      hora: formData.hora,
      motivo: formData.motivo,
      estado: 'pendiente',
      direccion: formData.direccion,
      notas: formData.notas
    };

    saveVisita(nuevaVisita);
    setFormData({
      pacienteId: '',
      fecha: new Date().toISOString().split('T')[0],
      hora: '',
      motivo: '',
      direccion: '',
      notas: ''
    });
    onGuardar();
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nueva Visita</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Cerrar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonSelect
              label="Paciente"
              labelPlacement="floating"
              value={formData.pacienteId}
              onIonChange={e => handlePacienteChange(e.detail.value)}
            >
              {pacientes.map(p => (
                <IonSelectOption key={p.id} value={p.id}>
                  {p.nombre} {p.apellido} - DNI: {p.dni}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput
              label="Fecha"
              labelPlacement="floating"
              type="date"
              value={formData.fecha}
              onIonInput={e => setFormData({ ...formData, fecha: e.detail.value! })}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Hora"
              labelPlacement="floating"
              type="time"
              value={formData.hora}
              onIonInput={e => setFormData({ ...formData, hora: e.detail.value! })}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Motivo"
              labelPlacement="floating"
              value={formData.motivo}
              onIonInput={e => setFormData({ ...formData, motivo: e.detail.value! })}
              placeholder="Ej: Control de presión"
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Dirección"
              labelPlacement="floating"
              value={formData.direccion}
              onIonInput={e => setFormData({ ...formData, direccion: e.detail.value! })}
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              label="Notas adicionales"
              labelPlacement="floating"
              value={formData.notas}
              onIonInput={e => setFormData({ ...formData, notas: e.detail.value! })}
              rows={3}
            />
          </IonItem>
        </IonList>

        <div className="ion-padding">
          <IonButton
            expand="block"
            onClick={handleSubmit}
            disabled={!formData.pacienteId || !formData.hora || !formData.motivo}
          >
            Guardar Visita
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
}
