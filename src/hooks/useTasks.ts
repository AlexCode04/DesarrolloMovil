import { useContext } from 'react';
import { TasksContext } from '../context/TasksContext';

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('useTasks debe usarse dentro de un TasksProvider');
  }
  return ctx;
};
