import type { Paciente, Visita } from '@/types';

export const PACIENTES_MOCK: Paciente[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    dni: '20123456',
    telefono: '1154789632',
    direccion: 'Av. Corrientes 1234, Buenos Aires',
    fechaNacimiento: '1985-03-15',
    obraSocial: 'OSDE'
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'López',
    dni: '22345678',
    telefono: '1156987412',
    direccion: 'Av. Santa Fe 4567, Buenos Aires',
    fechaNacimiento: '1990-07-22',
    obraSocial: 'Swiss Medical'
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellido: 'Gómez',
    dni: '18987654',
    telefono: '1165432187',
    direccion: 'Av. Rivadavia 789, Buenos Aires',
    fechaNacimiento: '1978-11-30',
    obraSocial: 'Galeno'
  },
  {
    id: '4',
    nombre: 'Ana',
    apellido: 'Fernández',
    dni: '25678901',
    telefono: '1198765432',
    direccion: 'Av. Cabildo 2345, Buenos Aires',
    fechaNacimiento: '1995-05-18',
    obraSocial: 'Medicus'
  },
  {
    id: '5',
    nombre: 'Roberto',
    apellido: 'Díaz',
    dni: '21234567',
    telefono: '1147896321',
    direccion: 'Av. Callao 1890, Buenos Aires',
    fechaNacimiento: '1982-09-25',
    obraSocial: 'OSDE'
  }
];

const hoy = new Date().toISOString().split('T')[0];

export const VISITAS_MOCK: Visita[] = [
  {
    id: '1',
    pacienteId: '1',
    medicoId: '2',
    fecha: hoy,
    hora: '09:00',
    motivo: 'Control de presión arterial',
    estado: 'pendiente',
    direccion: 'Av. Corrientes 1234, Buenos Aires',
    notas: ''
  },
  {
    id: '2',
    pacienteId: '2',
    medicoId: '2',
    fecha: hoy,
    hora: '11:00',
    motivo: 'Control post-operatorio',
    estado: 'pendiente',
    direccion: 'Av. Santa Fe 4567, Buenos Aires',
    notas: ''
  },
  {
    id: '3',
    pacienteId: '3',
    medicoId: '2',
    fecha: hoy,
    hora: '14:00',
    motivo: 'Consulta por diabetes',
    estado: 'pendiente',
    direccion: 'Av. Rivadavia 789, Buenos Aires',
    notas: ''
  },
  {
    id: '4',
    pacienteId: '4',
    medicoId: '2',
    fecha: hoy,
    hora: '16:00',
    motivo: 'Control de rutina',
    estado: 'pendiente',
    direccion: 'Av. Cabildo 2345, Buenos Aires',
    notas: ''
  }
];

export const initializeLocalStorage = (): void => {
  if (!localStorage.getItem('medicare_mobile_pacientes')) {
    localStorage.setItem('medicare_mobile_pacientes', JSON.stringify(PACIENTES_MOCK));
  }
  if (!localStorage.getItem('medicare_mobile_visitas')) {
    localStorage.setItem('medicare_mobile_visitas', JSON.stringify(VISITAS_MOCK));
  }
};
