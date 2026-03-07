import type { Paciente } from '@/types';

const STORAGE_KEY = 'medicare_mobile_pacientes';

export const getPacientes = (): Paciente[] => {
  const pacientesJson = localStorage.getItem(STORAGE_KEY);
  return pacientesJson ? JSON.parse(pacientesJson) : [];
};

export const getPacienteById = (id: string): Paciente | undefined => {
  const pacientes = getPacientes();
  return pacientes.find(p => p.id === id);
};
