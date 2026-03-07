import { useState, useEffect } from 'react';
import type { Paciente } from '@/types';
import { validateDNI } from '@/services/pacienteService';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';

interface FormularioPacienteProps {
  pacienteAEditar: Paciente | null;
  onGuardar: (paciente: Paciente) => void;
  onCancelar: () => void;
}

export function FormularioPaciente({ pacienteAEditar, onGuardar, onCancelar }: FormularioPacienteProps) {
  const [formData, setFormData] = useState<Omit<Paciente, 'id'>>({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    fechaNacimiento: '',
    direccion: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (pacienteAEditar) {
      setFormData({
        nombre: pacienteAEditar.nombre,
        apellido: pacienteAEditar.apellido,
        dni: pacienteAEditar.dni,
        telefono: pacienteAEditar.telefono,
        email: pacienteAEditar.email || '',
        fechaNacimiento: pacienteAEditar.fechaNacimiento || '',
        direccion: pacienteAEditar.direccion || ''
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',
        email: '',
        fechaNacimiento: '',
        direccion: ''
      });
    }
    setErrors({});
  }, [pacienteAEditar]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    }

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es obligatorio';
    } else if (!validateDNI(formData.dni)) {
      newErrors.dni = 'El DNI debe tener entre 7 y 8 dígitos numéricos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const paciente: Paciente = {
      id: pacienteAEditar?.id || Date.now().toString(),
      ...formData
    };

    onGuardar(paciente);
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
          {pacienteAEditar ? 'Editar Paciente' : 'Nuevo Paciente'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium mb-2">
                Nombre <span className="text-destructive">*</span>
              </label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
              />
              {errors.nombre && (
                <span className="text-sm text-destructive">{errors.nombre}</span>
              )}
            </div>

            <div>
              <label htmlFor="apellido" className="block text-sm font-medium mb-2">
                Apellido <span className="text-destructive">*</span>
              </label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) => handleChange('apellido', e.target.value)}
              />
              {errors.apellido && (
                <span className="text-sm text-destructive">{errors.apellido}</span>
              )}
            </div>

            <div>
              <label htmlFor="dni" className="block text-sm font-medium mb-2">
                DNI <span className="text-destructive">*</span>
              </label>
              <Input
                id="dni"
                value={formData.dni}
                onChange={(e) => handleChange('dni', e.target.value)}
              />
              {errors.dni && (
                <span className="text-sm text-destructive">{errors.dni}</span>
              )}
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium mb-2">
                Teléfono
              </label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="fechaNacimiento" className="block text-sm font-medium mb-2">
                Fecha de Nacimiento
              </label>
              <Input
                id="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="direccion" className="block text-sm font-medium mb-2">
                Dirección
              </label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancelar}>
              Cancelar
            </Button>
            <Button type="submit">
              {pacienteAEditar ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
