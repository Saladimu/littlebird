import { BirdSkin, Achievement, Upgrade } from '../types';

export const INITIAL_SKINS: BirdSkin[] = [
  {
    id: 'azure',
    name: 'Azure Chirp',
    color: '#38bdf8',
    secondaryColor: '#0284c7',
    glowColor: '#38bdf8',
    price: 0,
    unlocked: true,
    description: 'The classic sky blue songbird. Agile and bright.',
    icon: 'Bird'
  },
  {
    id: 'solar',
    name: 'Solar Finch',
    color: '#fbbf24',
    secondaryColor: '#d97706',
    glowColor: '#fbbf24',
    price: 50,
    unlocked: false,
    description: 'Radiates the warm morning sun across the canopy.',
    icon: 'Sun'
  },
  {
    id: 'sakura',
    name: 'Sakura Pip',
    color: '#f472b6',
    secondaryColor: '#db2777',
    glowColor: '#f472b6',
    price: 120,
    unlocked: false,
    description: 'Born from cherry blossom petals dancing in spring winds.',
    icon: 'Flower'
  },
  {
    id: 'nebula',
    name: 'Nebula Sprite',
    color: '#9E7FFF',
    secondaryColor: '#7c3aed',
    glowColor: '#9E7FFF',
    price: 250,
    unlocked: false,
    description: 'Carries stardust from distant galaxies on its wings.',
    icon: 'Sparkles'
  },
  {
    id: 'emerald',
    name: 'Jade Weaver',
    color: '#34d399',
    secondaryColor: '#059669',
    glowColor: '#34d399',
    price: 400,
    unlocked: false,
    description: 'Guardian spirit of the deepest, oldest whispering woods.',
    icon: 'Shield'
  },
  {
    id: 'phoenix',
    name: 'Aether Phoenix',
    color: '#f87171',
    secondaryColor: '#dc2626',
    glowColor: '#f87171',
    price: 800,
    unlocked: false,
    description: 'Legendary mythical bird wreathed in eternal divine flames.',
    icon: 'Flame'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_flight',
    title: 'First Flight',
    description: 'Complete your first flight session.',
    icon: 'Play',
    reward: 20,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'dew_collector',
    title: 'Morning Dew Collector',
    description: 'Collect a total of 50 sun-dew drops.',
    icon: 'Droplet',
    reward: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'high_flyer',
    title: 'High Flyer',
    description: 'Reach a score of 20 in a single run.',
    icon: 'Award',
    reward: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 20
  },
  {
    id: 'master_navigator',
    title: 'Canopy Master',
    description: 'Reach a score of 50 in a single run.',
    icon: 'Crown',
    reward: 300,
    unlocked: false,
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'fashionista',
    title: 'Avian Fashionista',
    description: 'Unlock 3 distinct bird skins.',
    icon: 'Palette',
    reward: 150,
    unlocked: false,
    progress: 1,
    maxProgress: 3
  }
];

export const INITIAL_UPGRADES: Upgrade[] = [
  {
    id: 'magnet',
    name: 'Dew Magnet',
    description: 'Increases magnetic pull radius for sun-dew drops.',
    level: 0,
    maxLevel: 5,
    basePrice: 40,
    multiplier: 1.6,
    icon: 'Magnet'
  },
  {
    id: 'shield_duration',
    name: 'Feather Shield',
    description: 'Shield powerups last 50% longer per level.',
    level: 0,
    maxLevel: 3,
    basePrice: 60,
    multiplier: 2.0,
    icon: 'ShieldCheck'
  },
  {
    id: 'dew_bonus',
    name: 'Golden Bloom',
    description: 'Earn +1 extra dew drop for every collection.',
    level: 0,
    maxLevel: 4,
    basePrice: 75,
    multiplier: 1.8,
    icon: 'Coins'
  }
];
