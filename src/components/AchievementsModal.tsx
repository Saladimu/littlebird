import React from 'react';
import { Trophy, CheckCircle2, Lock, Play, Droplet, Award, Crown, Palette } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  onClose,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Play': return <Play className="w-5 h-5 text-primary" />;
      case 'Droplet': return <Droplet className="w-5 h-5 text-sky-400" />;
      case 'Award': return <Award className="w-5 h-5 text-amber-400" />;
      case 'Crown': return <Crown className="w-5 h-5 text-yellow-300" />;
      case 'Palette': return <Palette className="w-5 h-5 text-pink-400" />;
      default: return <Trophy className="w-5 h-5 text-primary" />;
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="relative z-25 flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-12">
      <div className="max-w-xl w-full bg-surface/95 backdrop-blur-xl border border-border/80 rounded-3xl p-6 md:p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>Skyward Milestones</span>
            </h2>
            <p className="text-textSecondary text-sm">
              Completed {unlockedCount} of {achievements.length} achievements
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-lg">
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </div>
        </div>

        {/* List */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
          {achievements.map((ach) => {
            const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  ach.unlocked
                    ? 'bg-success/5 border-success/30'
                    : 'bg-background/50 border-border/80'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                  ach.unlocked 
                    ? 'bg-success/10 border-success/30' 
                    : 'bg-surface border-border'
                }`}>
                  {ach.unlocked ? <CheckCircle2 className="w-6 h-6 text-success" /> : getIcon(ach.icon)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-white text-base truncate">{ach.title}</h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
                      💧 +{ach.reward}
                    </span>
                  </div>
                  <p className="text-textSecondary text-xs mb-3">{ach.description}</p>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-surface border border-border overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${ach.unlocked ? 'bg-success' : 'bg-primary'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-textSecondary">
                      {ach.progress}/{ach.maxProgress}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="py-3 px-6 rounded-xl bg-surface hover:bg-border/80 border border-border text-white font-semibold text-sm transition-all"
          >
            Back to Menu
          </button>
        </div>

      </div>
    </div>
  );
};
