import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonTextarea,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonBadge,
  useIonViewWillEnter
} from '@ionic/react';
import { addOutline, closeCircleOutline } from 'ionicons/icons';
import { getVisitaById, updateVisitaEstado, saveVisita } from '@/services/visitaService';
import { getPacienteById } from '@/services/pacienteService';
import type { Visita, Medicamento } from '@/types';

export function DetalleVisitaPage() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [visita, setVisita] = useState<Visita | null>(null);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [nuevoMedicamento, setNuevoMedicamento] = useState<Omit<Medicamento, 'id'>>({
    nombre: '',
    dosis: '',
    frecuencia: '',
    duracion: ''
  });
  const [indicaciones, setIndicaciones] = useState('');

  useIonViewWillEnter(() => {
    // Leer el ID directamente de la URL para evitar el closure stale de Ionic
    const pathParts = window.location.pathname.split('/');
    const currentId = pathParts[pathParts.length - 1];
    if (currentId && currentId !== 'visitas') {
      cargarVisita(currentId);
    }
  });

  useEffect(() => {
    if (id) {
      cargarVisita(id);
    }
  }, [id]);

  const cargarVisita = (visitaId: string) => {
    const visitaData = getVisitaById(visitaId);
    if (visitaData) {
      setVisita(visitaData);
      // Cargar receta guardada si existe
      if (visitaData.receta) {
        setMedicamentos(visitaData.receta.medicamentos);
        setIndicaciones(visitaData.receta.indicaciones);
      } else {
        setMedicamentos([]);
        setIndicaciones('');
      }
    } else {
      setVisita(null);
    }
  };

  const getPacienteInfo = () => {
    if (!visita) return null;
    return getPacienteById(visita.pacienteId);
  };

  const guardarReceta = (meds: typeof medicamentos, inds: string) => {
    if (visita) {
      saveVisita({ ...visita, receta: { medicamentos: meds, indicaciones: inds } });
    }
  };

  const handleAgregarMedicamento = () => {
    if (nuevoMedicamento.nombre && nuevoMedicamento.dosis) {
      const medicamento: Medicamento = {
        id: Date.now().toString(),
        ...nuevoMedicamento
      };
      const nuevos = [...medicamentos, medicamento];
      setMedicamentos(nuevos);
      guardarReceta(nuevos, indicaciones);
      setNuevoMedicamento({
        nombre: '',
        dosis: '',
        frecuencia: '',
        duracion: ''
      });
    }
  };

  const handleEliminarMedicamento = (id: string) => {
    const nuevos = medicamentos.filter(m => m.id !== id);
    setMedicamentos(nuevos);
    guardarReceta(nuevos, indicaciones);
  };

  const handleIniciarAtencion = () => {
    if (visita) {
      updateVisitaEstado(visita.id, 'en_curso');
      cargarVisita(visita.id);
    }
  };

  const handleComenzarAtencion = () => {
    if (visita) {
      updateVisitaEstado(visita.id, 'en_curso');
      cargarVisita(visita.id);
    }
  };

  const handleFinalizarVisita = () => {
    if (visita) {
      // Guardar receta antes de finalizar
      saveVisita({ ...visita, receta: { medicamentos, indicaciones } });
      updateVisitaEstado(visita.id, 'finalizada');
      history.goBack();
    }
  };

  const paciente = getPacienteInfo();

  if (!visita) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/visitas" />
            </IonButtons>
            <IonTitle>Detalle de Visita</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonCard>
            <IonCardContent>
              <p>Visita no encontrada</p>
              <p className="text-sm text-gray-500">ID: {id}</p>
              <IonButton expand="block" routerLink="/visitas" className="mt-4">
                Volver a Visitas
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  if (!paciente) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/visitas" />
            </IonButtons>
            <IonTitle>Detalle de Visita</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonCard>
            <IonCardContent>
              <p>Paciente no encontrado</p>
              <IonButton expand="block" routerLink="/visitas" className="mt-4">
                Volver a Visitas
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/visitas" />
          </IonButtons>
          <IonTitle>Detalle de Visita</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <div className="flex justify-between  items-center">
              <IonCardTitle>{paciente.nombre} {paciente.apellido}</IonCardTitle>
              <IonBadge color="primary">{visita.estado}</IonBadge>
            </div>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>
                  <h3>DNI</h3>
                  <p>{paciente.dni}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Obra Social</h3>
                  <p>{paciente.obraSocial}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Dirección</h3>
                  <p>{visita.direccion}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Horario</h3>
                  <p>{visita.hora}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Motivo</h3>
                  <p>{visita.motivo}</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {visita.estado === 'pendiente' && (
          <div className="ion-padding">
            <IonButton expand="block" onClick={handleIniciarAtencion}>
              Iniciar Atención
            </IonButton>
          </div>
        )}

        {visita.estado === 'en_camino' && (
          <div className="ion-padding">
            <IonButton expand="block" color="secondary" onClick={handleComenzarAtencion}>
              Comenzar Atención
            </IonButton>
          </div>
        )}

        {visita.estado === 'en_curso' && (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Receta Médica</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="space-y-4">
                  <IonInput
                    label="Medicamento"
                    labelPlacement="floating"
                    fill="outline"
                    value={nuevoMedicamento.nombre}
                    onIonInput={e => setNuevoMedicamento({ ...nuevoMedicamento, nombre: e.detail.value! })}
                  />
                  <IonInput
                    label="Dosis"
                    labelPlacement="floating"
                    fill="outline"
                    value={nuevoMedicamento.dosis}
                    onIonInput={e => setNuevoMedicamento({ ...nuevoMedicamento, dosis: e.detail.value! })}
                  />
                  <IonInput
                    label="Frecuencia"
                    labelPlacement="floating"
                    fill="outline"
                    value={nuevoMedicamento.frecuencia}
                    onIonInput={e => setNuevoMedicamento({ ...nuevoMedicamento, frecuencia: e.detail.value! })}
                  />
                  <IonInput
                    label="Duración"
                    labelPlacement="floating"
                    fill="outline"
                    value={nuevoMedicamento.duracion}
                    onIonInput={e => setNuevoMedicamento({ ...nuevoMedicamento, duracion: e.detail.value! })}
                  />
                  <IonButton expand="block" onClick={handleAgregarMedicamento}>
                    <IonIcon icon={addOutline} slot="start" />
                    Agregar a Receta
                  </IonButton>
                </div>

                {medicamentos.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Medicamentos Recetados:</h3>
                    <IonList>
                      {medicamentos.map((med) => (
                        <IonItem key={med.id}>
                          <IonLabel>
                            <h3>{med.nombre}</h3>
                            <p>Dosis: {med.dosis}</p>
                            <p>Frecuencia: {med.frecuencia}</p>
                            <p>Duración: {med.duracion}</p>
                          </IonLabel>
                          <IonIcon
                            icon={closeCircleOutline}
                            slot="end"
                            color="danger"
                            onClick={() => handleEliminarMedicamento(med.id)}
                          />
                        </IonItem>
                      ))}
                    </IonList>
                  </div>
                )}

                <div className="mt-4">
                  <IonTextarea
                    label="Indicaciones generales"
                    labelPlacement="floating"
                    fill="outline"
                    rows={4}
                    value={indicaciones}
                    onIonInput={e => {
                      const val = e.detail.value!;
                      setIndicaciones(val);
                      guardarReceta(medicamentos, val);
                    }}
                  />
                </div>
              </IonCardContent>
            </IonCard>

            <div className="ion-padding">
              <IonButton
                expand="block"
                color="success"
                onClick={handleFinalizarVisita}
                disabled={medicamentos.length === 0}
              >
                Finalizar Visita
              </IonButton>
            </div>
          </>
        )}

        {(visita.estado === 'finalizada' || visita.estado === 'cancelada') && medicamentos.length > 0 && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Receta Médica</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                {medicamentos.map((med) => (
                  <IonItem key={med.id}>
                    <IonLabel>
                      <h3>{med.nombre}</h3>
                      <p>Dosis: {med.dosis}</p>
                      {med.frecuencia && <p>Frecuencia: {med.frecuencia}</p>}
                      {med.duracion && <p>Duración: {med.duracion}</p>}
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
              {indicaciones ? (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600">Indicaciones:</p>
                  <p className="text-sm mt-1">{indicaciones}</p>
                </div>
              ) : null}
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
}
