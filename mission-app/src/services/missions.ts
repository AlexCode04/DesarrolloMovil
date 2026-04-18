export interface Mission {
  id: number;
  title: string;
  description: string;
  points: number;
  icon: string;
  completed: boolean;
  locked: boolean; 
}

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 1,
    title: 'Captura el Momento',
    description: 'Toma una foto con tu cámara para completar esta misión.',
    points: 50,
    icon: '📸',
    completed: false,
    locked: false,
  },
  {
    id: 2,
    title: 'Explorador Urbano',
    description: 'Muévete más de 30 metros de tu posición inicial.',
    points: 80,
    icon: '🗺️',
    completed: false,
    locked: false,
  },
  {
    id: 3,
    title: 'Zen Master',
    description: 'Mantente quieto por 10 segundos. El teléfono vibrará al completarlo.',
    points: 100,
    icon: '🧘',
    completed: false,
    locked: true,
  },
];

export const TOTAL_POINTS = INITIAL_MISSIONS.reduce((a, m) => a + m.points, 0);


export function calcDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
    const R = 6371000;
    const Fi1 = (lat1 * Math.PI) / 180;
    const Fi2 = (lat2 * Math.PI) / 180;
    const Diferencias_fi = ((lat2 - lat1) * Math.PI) / 180;
    const Diferencias_lambda = ((lon2 - lon1) * Math.PI) / 180;
    const a =
    Math.sin(Diferencias_fi / 2) ** 2 +
    Math.cos(Fi1) * Math.cos(Fi2) * Math.sin(Diferencias_lambda / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}