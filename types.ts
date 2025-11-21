export enum Season {
  Spring = 'Spring',
  Summer = 'Summer',
  Autumn = 'Autumn',
  Winter = 'Winter'
}

export interface Particle {
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  type: 'circle' | 'petal' | 'leaf';
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';