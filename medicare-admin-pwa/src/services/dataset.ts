import type { User, Paciente, Turno } from '@/types';

export const USERS_MOCK: User[] = [
  {
    id: '1',
    email: 'recepcion@medicare.com',
    password: '123456',
    nombre: 'María',
    apellido: 'González',
    rol: 'recepcionista'
  },
  {
    id: '2',
    email: 'doctor@medicare.com',
    password: '123456',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    rol: 'medico'
  },
  {
    id: '3',
    email: 'admin@medicare.com',
    password: '123456',
    nombre: 'Ana',
    apellido: 'Martínez',
    rol: 'admin'
  }
];

export const PACIENTES_MOCK: Paciente[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    dni: '12345678',
    telefono: '1145678901',
    email: 'juan.perez@email.com',
    fechaNacimiento: '1985-03-15',
    direccion: 'Av. Corrientes 1234, CABA'
  },
  {
    id: '2',
    nombre: 'Laura',
    apellido: 'Fernández',
    dni: '23456789',
    telefono: '1156789012',
    email: 'laura.fernandez@email.com',
    fechaNacimiento: '1990-07-22',
    direccion: 'Calle Falsa 567, CABA'
  },
  {
    id: '3',
    nombre: 'Roberto',
    apellido: 'Gómez',
    dni: '34567890',
    telefono: '1167890123',
    email: 'roberto.gomez@email.com',
    fechaNacimiento: '1978-11-08',
    direccion: 'Av. Santa Fe 890, CABA'
  },
  {
    id: '4',
    nombre: 'Sofía',
    apellido: 'López',
    dni: '45678901',
    telefono: '1178901234',
    email: 'sofia.lopez@email.com',
    fechaNacimiento: '1995-05-30',
    direccion: 'Av. Rivadavia 2345, CABA'
  },
  {
    id: '5',
    nombre: 'Miguel',
    apellido: 'Sánchez',
    dni: '56789012',
    telefono: '1189012345',
    email: 'miguel.sanchez@email.com',
    fechaNacimiento: '1982-09-17',
    direccion: 'Calle Lima 678, CABA'
  }
];

export const TURNOS_MOCK: Turno[] = [
  {
    id: '1',
    pacienteId: '1',
    medicoId: '2',
    fecha: new Date().toISOString().split('T')[0],
    hora: '09:00',
    motivo: 'Control general',
    estado: 'pendiente'
  },
  {
    id: '2',
    pacienteId: '2',
    medicoId: '2',
    fecha: new Date().toISOString().split('T')[0],
    hora: '10:30',
    motivo: 'Control de presión',
    estado: 'confirmado'
  },
  {
    id: '3',
    pacienteId: '3',
    medicoId: '2',
    fecha: new Date().toISOString().split('T')[0],
    hora: '11:00',
    motivo: 'Consulta por dolor',
    estado: 'pendiente'
  },
  {
    id: '4',
    pacienteId: '4',
    medicoId: '2',
    fecha: new Date().toISOString().split('T')[0],
    hora: '14:00',
    motivo: 'Seguimiento tratamiento',
    estado: 'finalizado'
  }
];

export const initializeLocalStorage = () => {
  if (!localStorage.getItem('medicare_pacientes')) {
    localStorage.setItem('medicare_pacientes', JSON.stringify(PACIENTES_MOCK));
  }
  
  if (!localStorage.getItem('medicare_turnos')) {
    localStorage.setItem('medicare_turnos', JSON.stringify(TURNOS_MOCK));
  }
};
