import { useState } from 'react';
import type { Paciente } from '@/types';
import { Button } from '@/ui/button';
import { Modal, ModalFooter } from '@/ui/modal';

interface TablaPacientesProps {
  pacientes: Paciente[];
  onEditar: (paciente: Paciente) => void;
  onEliminar: (id: string) => void;
}

export function TablaPacientes({ pacientes, onEditar, onEliminar }: TablaPacientesProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pacienteToDelete, setPacienteToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setPacienteToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (pacienteToDelete) {
      onEliminar(pacienteToDelete);
    }
    setShowDeleteModal(false);
    setPacienteToDelete(null);
  };

  if (pacientes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay pacientes registrados
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium">Nombre Completo</th>
              <th className="text-left p-4 font-medium">DNI</th>
              <th className="text-left p-4 font-medium">Teléfono</th>
              <th className="text-right p-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((paciente) => (
              <tr key={paciente.id} className="border-b hover:bg-muted/50">
                <td className="p-4">
                  {paciente.nombre} {paciente.apellido}
                </td>
                <td className="p-4">{paciente.dni}</td>
                <td className="p-4">{paciente.telefono}</td>
                <td className="p-4">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditar(paciente)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(paciente.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar eliminación"
      >
        <p>¿Está seguro que desea eliminar este paciente?</p>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
