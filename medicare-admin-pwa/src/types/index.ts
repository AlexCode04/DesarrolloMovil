export type UserRole = 'recepcionista' | 'medico' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
  avatar?: string;
}

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email?: string;
  fechaNacimiento?: string;
  direccion?: string;
}

export interface Turno {
  id: string;
  pacienteId: string;
  medicoId: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'finalizado';
}
