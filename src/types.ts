export type GameState = 'menu' | 'playing' | 'gameover' | 'shop' | 'achievements';

export interface BirdSkin {
  id: string;
  name: string;
  color: string;
  secondaryColor: string;
  glowColor: string;
  price: number;
  unlocked: boolean;
  description: string;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  basePrice: number;
  multiplier: number;
  icon: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface Obstacle {
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  passed: boolean;
  type: 'crystal' | 'thorn' | 'pillar';
  color: string;
}

export interface Collectible {
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  type: 'dew' | 'star' | 'shield' | 'magnet';
  bobOffset: number;
}
