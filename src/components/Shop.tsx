import React, { useState } from 'react';
import { ShoppingBag, Check, Lock, Sparkles, Zap, ShieldCheck, Magnet, Coins } from 'lucide-react';
import { BirdSkin, Upgrade } from '../types';

interface ShopProps {
  skins: BirdSkin[];
  upgrades: Upgrade[];
  dewDrops: number;
  selectedSkinId: string;
  onSelectSkin: (id: string) => void;
  onBuySkin: (skin: BirdSkin) => void;
  onUpgrade: (upgrade: Upgrade) => void;
  onClose: () => void;
}

export const Shop: React.FC<ShopProps> = ({
  skins,
  upgrades,
  dewDrops,
  selectedSkinId,
  onSelectSkin,
  onBuySkin,
  onUpgrade,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'skins' | 'upgrades'>('skins');

  const getUpgradeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Magnet': return <Magnet className="w-5 h-5 text-primary" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-success" />;
      case 'Coins': return <Coins className="w-5 h-5 text-amber-400" />;
      default: return <Zap className="w-5 h-5 text-secondary" />;
    }
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-12">
      <div className="max-w-2xl w-full bg-surface/95 backdrop-blur-xl border border-border/80 rounded-3xl p-6 md:p-8 shadow-2xl">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <span>Feather Sanctuary Shop</span>
            </h2>
            <p className="text-textSecondary text-sm">Customize your bird and enhance your flight powers.</p>
          </div>
          <div className="flex items-center bg-background/80 border border-border rounded-2xl p-1.5">
            <button
              onClick={() => setActiveTab('skins')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'skins' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-textSecondary hover:text-white'
              }`}
            >
              Bird Skins
            </button>
            <button
              onClick={() => setActiveTab('upgrades')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'upgrades' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-textSecondary hover:text-white'
              }`}
            >
              Power Ups
            </button>
          </div>
        </div>

        {/* Content Section */}
        {activeTab === 'skins' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2">
            {skins.map((skin) => {
              const isSelected = selectedSkinId === skin.id;
              const canAfford = dewDrops >= skin.price;
              return (
                <div
                  key={skin.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20'
                      : 'bg-background/50 border-border/80 hover:border-border'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                        style={{ background: `linear-gradient(135deg, ${skin.color}, ${skin.secondaryColor})` }}
                      >
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      {isSelected ? (
                        <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/30 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Equipped
                        </span>
                      ) : skin.unlocked ? (
                        <span className="px-3 py-1 bg-success/20 text-success text-xs font-bold rounded-full border border-success/30">
                          Unlocked
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full border border-amber-500/30 flex items-center gap-1">
                          💧 {skin.price}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-base mb-1">{skin.name}</h3>
                    <p className="text-textSecondary text-xs mb-4 leading-relaxed">{skin.description}</p>
                  </div>
                  <div>
                    {skin.unlocked ? (
                      <button
                        onClick={() => onSelectSkin(skin.id)}
                        disabled={isSelected}
                        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all ${
                          isSelected
                            ? 'bg-surface text-textSecondary cursor-default'
                            : 'bg-surface hover:bg-border border border-border text-white'
                        }`}
                      >
                        {isSelected ? 'Equipped' : 'Equip Skin'}
                      </button>
                    ) : (
                      <button
                        onClick={() => onBuySkin(skin)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                          canAfford
                            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/20 hover:opacity-95'
                            : 'bg-surface text-textSecondary/50 border border-border cursor-not-allowed'
                        }`}
                      >
                        <Lock className="w-4 h-4" />
                        <span>Unlock for 💧 {skin.price}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
            {upgrades.map((upgrade) => {
              const currentPrice = Math.round(upgrade.basePrice * Math.pow(upgrade.multiplier, upgrade.level));
              const isMax = upgrade.level >= upgrade.maxLevel;
              const canAfford = dewDrops >= currentPrice && !isMax;
              return (
                <div
                  key={upgrade.id}
                  className="p-4 rounded-2xl bg-background/50 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center">
                      {getUpgradeIcon(upgrade.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white text-base">{upgrade.name}</h3>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface border border-border text-primary">
                          Lvl {upgrade.level}/{upgrade.maxLevel}
                        </span>
                      </div>
                      <p className="text-textSecondary text-xs">{upgrade.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onUpgrade(upgrade)}
                    disabled={!canAfford || isMax}
                    className={`w-full sm:w-auto py-2.5 px-5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      isMax
                        ? 'bg-success/20 text-success border border-success/30 cursor-default'
                        : canAfford
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/20 hover:opacity-95'
                        : 'bg-surface text-textSecondary/50 border border-border cursor-not-allowed'
                    }`}
                  >
                    {isMax ? (
                      <span>Maxed Out</span>
                    ) : (
                      <>
                        <span>Upgrade</span>
                        <span className="text-amber-300">💧 {currentPrice}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Close */}
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
