import React, { createContext, useState, ReactNode, useMemo, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  done: boolean;
  createdAt: number;
}

interface TasksContextValue {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, partial: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

export const TasksContext = createContext<TasksContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
}

const TASKS_STORAGE_KEY = 'tasks-app:tasks-v2';

export const TasksProvider: React.FC<Props> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Cargar tareas almacenadas (simple persistencia en localStorage)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Task[];
        setTasks(parsed);
      }
    } catch {
      // ignorar errores de parseo
    }
  }, []);

  // Guardar cambios de tareas
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignorar errores de almacenamiento
    }
  }, [tasks]);

  const addTask: TasksContextValue['addTask'] = (taskInput) => {
    const timestamp = Date.now();
    const newTask: Task = {
      id: String(timestamp),
      createdAt: timestamp,
      done: taskInput.done ?? false,
      title: taskInput.title,
      description: taskInput.description,
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  const updateTask: TasksContextValue['updateTask'] = (id, partial) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...partial } : task)));
  };

  const deleteTask: TasksContextValue['deleteTask'] = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const getTaskById: TasksContextValue['getTaskById'] = (id) => {
    return tasks.find((task) => task.id === id);
  };

  const value = useMemo(
    () => ({ tasks, addTask, updateTask, deleteTask, getTaskById }),
    [tasks]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};
