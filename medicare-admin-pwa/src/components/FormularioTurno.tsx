import { useState, useEffect } from 'react';
import type { Turno, Paciente } from '@/types';
import { getPacientes } from '@/services/pacienteService';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';

interface FormularioTurnoProps {
  turnoAEditar: Turno | null;
  onGuardar: (turno: Turno) => void;
  onCancelar: () => void;
}

export function FormularioTurno({ turnoAEditar, onGuardar, onCancelar }: FormularioTurnoProps) {
  const [formData, setFormData] = useState({
    pacienteId: '',
    medicoId: '2',
    fecha: new Date().toISOString().split('T')[0],
    hora: '',
    motivo: '',
    estado: 'pendiente' as Turno['estado']
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  useEffect(() => {
    setPacientes(getPacientes());
  }, []);

  useEffect(() => {
    if (turnoAEditar) {
      setFormData({
        pacienteId: turnoAEditar.pacienteId,
        medicoId: turnoAEditar.medicoId,
        fecha: turnoAEditar.fecha,
        hora: turnoAEditar.hora,
        motivo: turnoAEditar.motivo,
        estado: turnoAEditar.estado
      });
    } else {
      setFormData({
        pacienteId: '',
        medicoId: '2',
        fecha: new Date().toISOString().split('T')[0],
        hora: '',
        motivo: '',
        estado: 'pendiente'
      });
    }
    setErrors({});
  }, [turnoAEditar]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.pacienteId) {
      newErrors.pacienteId = 'Debe seleccionar un paciente';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es obligatoria';
    }

    if (!formData.hora) {
      newErrors.hora = 'La hora es obligatoria';
    }

    if (!formData.motivo.trim()) {
      newErrors.motivo = 'El motivo es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const turno: Turno = {
      id: turnoAEditar?.id || Date.now().toString(),
      ...formData
    };

    onGuardar(turno);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {turnoAEditar ? 'Editar Turno' : 'Nuevo Turno'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pacienteId" className="block text-sm font-medium mb-2">
                Paciente <span className="text-destructive">*</span>
              </label>
              <select
                id="pacienteId"
                value={formData.pacienteId}
                onChange={(e) => handleChange('pacienteId', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Seleccione un paciente</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} {p.apellido} - DNI: {p.dni}
                  </option>
                ))}
              </select>
              {errors.pacienteId && (
                <span className="text-sm text-destructive">{errors.pacienteId}</span>
              )}
            </div>

            <div>
              <label htmlFor="fecha" className="block text-sm font-medium mb-2">
                Fecha <span className="text-destructive">*</span>
              </label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)}
              />
              {errors.fecha && (
                <span className="text-sm text-destructive">{errors.fecha}</span>
              )}
            </div>

            <div>
              <label htmlFor="hora" className="block text-sm font-medium mb-2">
                Hora <span className="text-destructive">*</span>
              </label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => handleChange('hora', e.target.value)}
              />
              {errors.hora && (
                <span className="text-sm text-destructive">{errors.hora}</span>
              )}
            </div>

            <div>
              <label htmlFor="estado" className="block text-sm font-medium mb-2">
                Estado
              </label>
              <select
                id="estado"
                value={formData.estado}
                onChange={(e) => handleChange('estado', e.target.value as Turno['estado'])}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="motivo" className="block text-sm font-medium mb-2">
                Motivo de Consulta <span className="text-destructive">*</span>
              </label>
              <Input
                id="motivo"
                value={formData.motivo}
                onChange={(e) => handleChange('motivo', e.target.value)}
                placeholder="Ej: Control general, dolor de cabeza, etc."
              />
              {errors.motivo && (
                <span className="text-sm text-destructive">{errors.motivo}</span>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancelar}>
              Cancelar
            </Button>
            <Button type="submit">
              {turnoAEditar ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
