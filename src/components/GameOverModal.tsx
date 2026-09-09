import React from 'react';
import { RotateCcw, Trophy, Home, ShoppingBag, Sparkles } from 'lucide-react';
import { BirdSkin } from '../types';

interface GameOverModalProps {
  score: number;
  highScore: number;
  dewCollected: number;
  selectedSkin: BirdSkin;
  onRestart: () => void;
  onGoHome: () => void;
  onOpenShop: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  dewCollected,
  selectedSkin,
  onRestart,
  onGoHome,
  onOpenShop,
}) => {
  const isNewHigh = score > highScore && score > 0;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <div className="max-w-md w-full bg-surface/95 backdrop-blur-xl border border-border/80 rounded-3xl p-8 text-center shadow-2xl animate-float">
        
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${selectedSkin.color}, ${selectedSkin.secondaryColor})` }}
        >
          <Sparkles className="w-10 h-10 text-white animate-spin-slow" />
        </div>

        <h2 className="text-3xl font-extrabold text-white mb-1">Flight Ended</h2>
        <p className="text-textSecondary text-sm mb-6">The little bird safely landed back in the grove.</p>

        {isNewHigh && (
          <div className="mb-6 py-2 px-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm inline-flex items-center gap-2 animate-bounce">
            <Trophy className="w-4 h-4" /> New High Score!
          </div>
        )}

        {/* Score Card */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-background/60 border border-border/60 rounded-2xl p-4 text-center">
            <p className="text-xs text-textSecondary font-medium mb-1">Flight Score</p>
            <p className="text-3xl font-extrabold text-white">{score}</p>
          </div>
          <div className="bg-background/60 border border-border/60 rounded-2xl p-4 text-center">
            <p className="text-xs text-textSecondary font-medium mb-1">Sun-Dew Drops</p>
            <p className="text-3xl font-extrabold text-amber-400">+{dewCollected}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Fly Again</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onOpenShop}
              className="py-3 px-4 rounded-xl bg-surface hover:bg-border/50 border border-border font-semibold text-sm text-text flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span>Shop</span>
            </button>
            <button
              onClick={onGoHome}
              className="py-3 px-4 rounded-xl bg-surface hover:bg-border/50 border border-border font-semibold text-sm text-text flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Home className="w-4 h-4 text-secondary" />
              <span>Menu</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
