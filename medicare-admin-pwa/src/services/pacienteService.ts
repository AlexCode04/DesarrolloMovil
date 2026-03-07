import type { Paciente } from '@/types';

const STORAGE_KEY = 'medicare_pacientes';

export const getPacientes = (): Paciente[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePaciente = (paciente: Paciente): void => {
  const pacientes = getPacientes();
  const index = pacientes.findIndex(p => p.id === paciente.id);
  
  if (index >= 0) {
    pacientes[index] = paciente;
  } else {
    pacientes.push(paciente);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pacientes));
};

export const deletePaciente = (id: string): void => {
  const pacientes = getPacientes().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pacientes));
};

export const getPacienteById = (id: string): Paciente | undefined => {
  return getPacientes().find(p => p.id === id);
};

export const validateDNI = (dni: string): boolean => {
  return /^\d{7,8}$/.test(dni);
};
