import type { Visita } from '@/types';

const STORAGE_KEY = 'medicare_mobile_visitas';

export const getVisitas = (): Visita[] => {
  const visitasJson = localStorage.getItem(STORAGE_KEY);
  return visitasJson ? JSON.parse(visitasJson) : [];
};

export const getVisitaById = (id: string): Visita | undefined => {
  const visitas = getVisitas();
  return visitas.find(v => v.id === id);
};

export const getVisitasByDate = (fecha: string): Visita[] => {
  const visitas = getVisitas();
  return visitas.filter(v => v.fecha === fecha);
};

export const saveVisita = (visita: Visita): void => {
  const visitas = getVisitas();
  const index = visitas.findIndex(v => v.id === visita.id);
  
  if (index >= 0) {
    visitas[index] = visita;
  } else {
    visitas.push(visita);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visitas));
};

export const updateVisitaEstado = (
  id: string, 
  estado: Visita['estado'], 
  motivoCancelacion?: string
): void => {
  const visitas = getVisitas();
  const index = visitas.findIndex(v => v.id === id);
  
  if (index >= 0) {
    visitas[index].estado = estado;
    if (motivoCancelacion) {
      visitas[index].motivoCancelacion = motivoCancelacion;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitas));
  }
};

export const reorderVisitas = (reorderedVisitas: Visita[]): void => {
  const allVisitas = getVisitas();
  const reorderedIds = new Set(reorderedVisitas.map(v => v.id));
  const otherVisitas = allVisitas.filter(v => !reorderedIds.has(v.id));
  
  const finalVisitas = [...reorderedVisitas, ...otherVisitas];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(finalVisitas));
};
