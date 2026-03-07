export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'recepcionista' | 'medico' | 'admin';
  avatar?: string;
}

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  obraSocial: string;
}

export interface Visita {
  id: string;
  pacienteId: string;
  medicoId: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'pendiente' | 'en_camino' | 'en_curso' | 'finalizada' | 'cancelada';
  direccion: string;
  notas?: string;
  motivoCancelacion?: string;
  receta?: {
    medicamentos: Medicamento[];
    indicaciones: string;
  };
}

export interface Medicamento {
  id: string;
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
}

export interface Receta {
  id: string;
  visitaId: string;
  medicamentos: Medicamento[];
  indicaciones: string;
  fecha: string;
}
