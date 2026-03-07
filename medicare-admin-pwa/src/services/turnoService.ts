import type { Turno } from '@/types';

const STORAGE_KEY = 'medicare_turnos';

export const getTurnos = (): Turno[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTurno = (turno: Turno): void => {
  const turnos = getTurnos();
  const index = turnos.findIndex(t => t.id === turno.id);
  
  if (index >= 0) {
    turnos[index] = turno;
  } else {
    turnos.push(turno);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(turnos));
};

export const deleteTurno = (id: string): void => {
  const turnos = getTurnos().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(turnos));
};

export const getTurnoById = (id: string): Turno | undefined => {
  return getTurnos().find(t => t.id === id);
};

export const getTurnosByDate = (fecha: string): Turno[] => {
  return getTurnos().filter(t => t.fecha === fecha);
};

export const getTurnosByPaciente = (pacienteId: string): Turno[] => {
  return getTurnos().filter(t => t.pacienteId === pacienteId);
};

export const getTurnosByMedico = (medicoId: string): Turno[] => {
  return getTurnos().filter(t => t.medicoId === medicoId);
};
