import { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar
} from '@ionic/react';
import { getPacientes } from '@/services/pacienteService';
import type { Paciente } from '@/types';

export function MisPacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const allPacientes = getPacientes();
    setPacientes(allPacientes);
    setFilteredPacientes(allPacientes);
  }, []);

  useEffect(() => {
    if (searchText === '') {
      setFilteredPacientes(pacientes);
    } else {
      const filtered = pacientes.filter(p =>
        p.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        p.apellido.toLowerCase().includes(searchText.toLowerCase()) ||
        p.dni.includes(searchText)
      );
      setFilteredPacientes(filtered);
    }
  }, [searchText, pacientes]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Pacientes</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonInput={e => setSearchText(e.detail.value!)}
            placeholder="Buscar por nombre o DNI"
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {filteredPacientes.map((paciente) => (
            <IonItem key={paciente.id}>
              <IonLabel>
                <h2 className="font-semibold">{paciente.nombre} {paciente.apellido}</h2>
                <p>DNI: {paciente.dni}</p>
                <p>Obra Social: {paciente.obraSocial}</p>
                <p className="text-sm text-gray-500">{paciente.direccion}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
