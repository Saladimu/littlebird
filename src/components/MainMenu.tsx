import React from 'react';
import { Play, ShoppingBag, Trophy, Sparkles, Feather } from 'lucide-react';
import { BirdSkin } from '../types';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenShop: () => void;
  onOpenAchievements: () => void;
  selectedSkin: BirdSkin;
  highScore: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenShop,
  onOpenAchievements,
  selectedSkin,
  highScore,
}) => {
  return (
    <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
      {/* Immersive Hero Card */}
      <div className="relative max-w-md w-full bg-surface/90 backdrop-blur-xl border border-border/80 rounded-3xl p-8 text-center shadow-2xl glow-primary">
        
        {/* Floating Bird Avatar preview */}
        <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
          <div 
            className="absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse"
            style={{ backgroundColor: selectedSkin.glowColor }}
          />
          <div 
            className="relative w-24 h-24 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg animate-float"
            style={{ 
              background: `linear-gradient(135deg, ${selectedSkin.color}, ${selectedSkin.secondaryColor})` 
            }}
          >
            <Feather className="w-12 h-12 text-white animate-pulse" />
            <div className="absolute top-2 right-4 w-3 h-3 bg-white rounded-full shadow-md" />
            <div className="absolute top-3 right-5 w-1 h-1 bg-black rounded-full" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active: {selectedSkin.name}</span>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Ready to Soar?
        </h2>
        <p className="text-textSecondary text-sm mb-6 leading-relaxed">
          Guide our little bird through the magical ether canopy, collect sun-dew drops, and unlock legendary feathers.
        </p>

        {/* High Score Banner */}
        <div className="bg-background/60 border border-border/60 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-textSecondary font-medium">Personal Best</p>
              <p className="text-lg font-bold text-white">{highScore} <span className="text-xs font-normal text-textSecondary">pts</span></p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-success bg-success/10 px-2.5 py-1 rounded-full font-semibold border border-success/20">
              Personal Record
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onStartGame}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
          >
            <Play className="w-6 h-6 fill-current group-hover:translate-x-1 transition-transform" />
            <span>Start Flight</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onOpenShop}
              className="py-3 px-4 rounded-xl bg-surface hover:bg-border/50 border border-border font-semibold text-sm text-text flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span>Skins & Upgrades</span>
            </button>
            <button
              onClick={onOpenAchievements}
              className="py-3 px-4 rounded-xl bg-surface hover:bg-border/50 border border-border font-semibold text-sm text-text flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Achievements</span>
            </button>
          </div>
        </div>

      </div>

      <footer className="mt-8 text-center text-xs text-textSecondary/60">
        Press <kbd className="px-2 py-1 bg-surface border border-border rounded text-text font-mono">Space</kbd> or <kbd className="px-2 py-1 bg-surface border border-border rounded text-text font-mono">Click</kbd> to flap wings.
      </footer>
    </div>
  );
};
