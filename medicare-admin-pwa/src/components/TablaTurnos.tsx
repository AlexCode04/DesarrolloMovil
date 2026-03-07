import { useState } from 'react';
import type { Turno } from '@/types';
import { getPacientes } from '@/services/pacienteService';
import { Button } from '@/ui/button';
import { Modal, ModalFooter } from '@/ui/modal';

interface TablaTurnosProps {
  turnos: Turno[];
  onEliminar?: (id: string) => void;
  onCambiarEstado?: (id: string, estado: Turno['estado']) => void;
}

export function TablaTurnos({ turnos, onEliminar, onCambiarEstado }: TablaTurnosProps) {
  const pacientes = getPacientes();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [turnoToDelete, setTurnoToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setTurnoToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (turnoToDelete && onEliminar) {
      onEliminar(turnoToDelete);
    }
    setShowDeleteModal(false);
    setTurnoToDelete(null);
  };

  const getPacienteNombre = (pacienteId: string): string => {
    const paciente = pacientes.find(p => p.id === pacienteId);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Desconocido';
  };

  const getEstadoBadge = (estado: Turno['estado']) => {
    const styles = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      confirmado: 'bg-blue-100 text-blue-800',
      cancelado: 'bg-red-100 text-red-800',
      finalizado: 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[estado]}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  if (turnos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay turnos registrados para hoy
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium">Hora</th>
            <th className="text-left p-4 font-medium">Paciente</th>
            <th className="text-left p-4 font-medium">Motivo</th>
            <th className="text-left p-4 font-medium">Estado</th>
            <th className="text-right p-4 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno) => (
            <tr key={turno.id} className="border-b hover:bg-muted/50">
              <td className="p-4 font-medium">{turno.hora}</td>
              <td className="p-4">{getPacienteNombre(turno.pacienteId)}</td>
              <td className="p-4">{turno.motivo}</td>
              <td className="p-4">{getEstadoBadge(turno.estado)}</td>
              <td className="p-4">
                <div className="flex gap-2 justify-end">
                  {onCambiarEstado && turno.estado === 'pendiente' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCambiarEstado(turno.id, 'finalizado')}
                    >
                      Finalizar
                    </Button>
                  )}
                  {onEliminar && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(turno.id)}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar eliminación"
      >
        <p>¿Está seguro que desea eliminar este turno?</p>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
