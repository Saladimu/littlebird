import React from 'react';
import { Volume2, VolumeX, Sparkles, ShoppingBag, Trophy, Home } from 'lucide-react';
import { GameState } from '../types';

interface HeaderProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  dewDrops: number;
  muted: boolean;
  toggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  gameState,
  setGameState,
  dewDrops,
  muted,
  toggleMute,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 bg-background/60 backdrop-blur-md border-b border-border/40">
      <div 
        onClick={() => setGameState('menu')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
            Skyward Melody
          </h1>
          <p className="text-xs text-textSecondary font-medium">The Little Bird's Journey</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Currency Display */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/80 border border-border/60 shadow-inner">
          <span className="text-amber-400 text-lg">💧</span>
          <span className="font-bold text-sm text-amber-200">{dewDrops}</span>
        </div>

        {/* Navigation Badges */}
        {gameState !== 'menu' && (
          <button
            onClick={() => setGameState('menu')}
            className="p-2 rounded-xl bg-surface/80 hover:bg-surface border border-border text-textSecondary hover:text-white transition-all"
            title="Main Menu"
          >
            <Home className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={() => setGameState('shop')}
          className={`p-2 rounded-xl border transition-all ${
            gameState === 'shop' 
              ? 'bg-primary text-white border-primary glow-primary' 
              : 'bg-surface/80 hover:bg-surface border-border text-textSecondary hover:text-white'
          }`}
          title="Feather Shop & Upgrades"
        >
          <ShoppingBag className="w-5 h-5" />
        </button>

        <button
          onClick={() => setGameState('achievements')}
          className={`p-2 rounded-xl border transition-all ${
            gameState === 'achievements' 
              ? 'bg-primary text-white border-primary glow-primary' 
              : 'bg-surface/80 hover:bg-surface border-border text-textSecondary hover:text-white'
          }`}
          title="Achievements"
        >
          <Trophy className="w-5 h-5" />
        </button>

        <button
          onClick={toggleMute}
          className="p-2 rounded-xl bg-surface/80 hover:bg-surface border border-border text-textSecondary hover:text-white transition-all"
          title={muted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {muted ? <VolumeX className="w-5 h-5 text-error" /> : <Volume2 className="w-5 h-5 text-success" />}
        </button>
      </div>
    </header>
  );
};
