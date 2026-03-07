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
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonReorderGroup,
  IonReorder,
  IonSegment,
  IonSegmentButton,
  IonBadge,
  IonAlert,
  IonFab,
  IonFabButton,
  IonIcon,
  ItemReorderEventDetail,
  useIonViewWillEnter
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { getVisitasByDate, updateVisitaEstado, reorderVisitas } from '@/services/visitaService';
import { getPacienteById } from '@/services/pacienteService';
import { getCurrentUser } from '@/services/authService';
import { FormularioVisita } from '@/components/FormularioVisita';
import type { Visita } from '@/types';

export function VisitasPage() {
  const history = useHistory();
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [filteredVisitas, setFilteredVisitas] = useState<Visita[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todas');
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [visitaToCancel, setVisitaToCancel] = useState<string | null>(null);
  const [showFormulario, setShowFormulario] = useState(false);

  const user = getCurrentUser();

  useIonViewWillEnter(() => {
    cargarVisitas();
  });

  useEffect(() => {
    cargarVisitas();
  }, []);

  useEffect(() => {
    aplicarFiltro();
  }, [visitas, filtroEstado]);

  const cargarVisitas = () => {
    const hoy = new Date().toISOString().split('T')[0];
    const visitasDelDia = getVisitasByDate(hoy);
    setVisitas(visitasDelDia);
  };

  const aplicarFiltro = () => {
    if (filtroEstado === 'todas') {
      setFilteredVisitas(visitas);
    } else if (filtroEstado === 'en_curso') {
      setFilteredVisitas(visitas.filter(v => v.estado === 'en_curso' || v.estado === 'en_camino'));
    } else {
      setFilteredVisitas(visitas.filter(v => v.estado === filtroEstado));
    }
  };

  const handleEnCamino = (id: string) => {
    updateVisitaEstado(id, 'en_camino');
    cargarVisitas();
  };

  const handleCancelar = (id: string) => {
    setVisitaToCancel(id);
    setShowCancelAlert(true);
  };

  const handleConfirmCancel = (motivo: string) => {
    if (visitaToCancel) {
      updateVisitaEstado(visitaToCancel, 'cancelada', motivo);
      cargarVisitas();
    }
    setVisitaToCancel(null);
  };

  const handleVerDetalle = (id: string) => {
    history.push(`/visitas/${id}`);
  };

  const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    const pendientes = filteredVisitas.filter(v => v.estado === 'pendiente');
    const reordered = event.detail.complete(pendientes);
    reorderVisitas(reordered);
    cargarVisitas();
  };

  const getPacienteNombre = (pacienteId: string): string => {
    const paciente = getPacienteById(pacienteId);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Paciente';
  };

  const getEstadoColor = (estado: Visita['estado']): string => {
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'en_camino': return 'primary';
      case 'en_curso': return 'secondary';
      case 'finalizada': return 'success';
      case 'cancelada': return 'danger';
      default: return 'medium';
    }
  };

  const getEstadoTexto = (estado: Visita['estado']): string => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_camino': return 'En camino';
      case 'en_curso': return 'En curso';
      case 'finalizada': return 'Finalizada';
      case 'cancelada': return 'Cancelada';
      default: return estado;
    }
  };

  const visitasPendientes = filteredVisitas.filter(v => v.estado === 'pendiente');
  const visitasOtras = filteredVisitas.filter(v => v.estado !== 'pendiente');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Visitas del Día</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={filtroEstado} onIonChange={e => setFiltroEstado(e.detail.value as string)}>
            <IonSegmentButton value="todas">
              <IonLabel>Todas</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pendiente">
              <IonLabel>Pendientes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="en_curso">
              <IonLabel>En curso</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="finalizada">
              <IonLabel>Finalizadas</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
            {visitasPendientes.map((visita) => (
              <IonItemSliding key={visita.id}>
                <IonItemOptions side="start">
                  <IonItemOption color="secondary" onClick={() => handleVerDetalle(visita.id)}>
                    Ver detalle
                  </IonItemOption>
                </IonItemOptions>

                <IonItem>
                  <IonReorder slot="start" />
                  <IonLabel>
                    <h2 className="font-semibold">{getPacienteNombre(visita.pacienteId)}</h2>
                    <p>{visita.hora} - {visita.motivo}</p>
                    <p className="text-sm text-gray-500">{visita.direccion}</p>
                  </IonLabel>
                  <IonBadge slot="end" color={getEstadoColor(visita.estado)}>
                    {getEstadoTexto(visita.estado)}
                  </IonBadge>
                </IonItem>

                <IonItemOptions side="end">
                  <IonItemOption color="primary" onClick={() => handleEnCamino(visita.id)}>
                    En camino
                  </IonItemOption>
                  <IonItemOption color="danger" onClick={() => handleCancelar(visita.id)}>
                    Cancelar
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonReorderGroup>

          {visitasOtras.map((visita) => (
            <IonItemSliding key={visita.id}>
              <IonItemOptions side="start">
                <IonItemOption color="secondary" onClick={() => handleVerDetalle(visita.id)}>
                  Ver detalle
                </IonItemOption>
              </IonItemOptions>

              <IonItem>
                <IonLabel>
                  <h2 className="font-semibold">{getPacienteNombre(visita.pacienteId)}</h2>
                  <p>{visita.hora} - {visita.motivo}</p>
                  <p className="text-sm text-gray-500">{visita.direccion}</p>
                </IonLabel>
                <IonBadge slot="end" color={getEstadoColor(visita.estado)}>
                  {getEstadoTexto(visita.estado)}
                </IonBadge>
              </IonItem>
            </IonItemSliding>
          ))}
        </IonList>

        <IonAlert
          isOpen={showCancelAlert}
          onDidDismiss={() => setShowCancelAlert(false)}
          header="Cancelar Visita"
          message="¿Está seguro que desea cancelar esta visita? Por favor, indique el motivo."
          inputs={[
            {
              name: 'motivo',
              type: 'textarea',
              placeholder: 'Motivo de cancelación'
            }
          ]}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Confirmar',
              handler: (data) => {
                if (data.motivo) {
                  handleConfirmCancel(data.motivo);
                }
              }
            }
          ]}
        />

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => setShowFormulario(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <FormularioVisita
          isOpen={showFormulario}
          onClose={() => setShowFormulario(false)}
          onGuardar={cargarVisitas}
          medicoId={user?.id || '2'}
        />
      </IonContent>
    </IonPage>
  );
}
