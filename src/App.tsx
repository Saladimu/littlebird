import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameState, BirdSkin, Achievement, Upgrade } from './types';
import { INITIAL_SKINS, INITIAL_ACHIEVEMENTS, INITIAL_UPGRADES } from './data/gameData';
import { soundManager } from './utils/audio';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { Shop } from './components/Shop';
import { AchievementsModal } from './components/AchievementsModal';
import { GameOverModal } from './components/GameOverModal';
import { GameCanvas } from './components/GameCanvas';

export function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  
  const [dewDrops, setDewDrops] = useState<number>(() => {
    const saved = localStorage.getItem('skyward_dew');
    return saved ? parseInt(saved, 10) : 50; // Start with 50 dew drops to explore shop!
  });
  
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('skyward_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [skins, setSkins] = useState<BirdSkin[]>(() => {
    const saved = localStorage.getItem('skyward_skins');
    return saved ? JSON.parse(saved) : INITIAL_SKINS;
  });
  
  const [selectedSkinId, setSelectedSkinId] = useState<string>(() => {
    const saved = localStorage.getItem('skyward_selected_skin');
    return saved || 'azure';
  });
  
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('skyward_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });
  
  const [upgrades, setUpgrades] = useState<Upgrade[]>(() => {
    const saved = localStorage.getItem('skyward_upgrades');
    return saved ? JSON.parse(saved) : INITIAL_UPGRADES;
  });
  
  const [muted, setMuted] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [dewCollectedThisRun, setDewCollectedThisRun] = useState<number>(0);

  // Persistence
  useEffect(() => {
    localStorage.setItem('skyward_dew', dewDrops.toString());
  }, [dewDrops]);
  
  useEffect(() => {
    localStorage.setItem('skyward_highscore', highScore.toString());
  }, [highScore]);
  
  useEffect(() => {
    localStorage.setItem('skyward_skins', JSON.stringify(skins));
  }, [skins]);
  
  useEffect(() => {
    localStorage.setItem('skyward_selected_skin', selectedSkinId);
  }, [selectedSkinId]);
  
  useEffect(() => {
    localStorage.setItem('skyward_achievements', JSON.stringify(achievements));
  }, [achievements]);
  
  useEffect(() => {
    localStorage.setItem('skyward_upgrades', JSON.stringify(upgrades));
  }, [upgrades]);

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    soundManager.muted = nextMuted;
  };

  const selectedSkin = skins.find((s) => s.id === selectedSkinId) || skins[0];

  const handleStartGame = () => {
    setCurrentScore(0);
    setDewCollectedThisRun(0);
    setGameState('playing');
  };

  const handleGameOver = (score: number, dewEarned: number) => {
    setCurrentScore(score);
    setDewCollectedThisRun(dewEarned);
    setDewDrops((prev) => prev + dewEarned);
    
    if (score > highScore) {
      setHighScore(score);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    // Check & update achievements
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.unlocked) return ach;
        let newProgress = ach.progress;
        
        if (ach.id === 'first_flight') {
          newProgress = 1;
        } else if (ach.id === 'dew_collector') {
          newProgress = Math.min(ach.maxProgress, ach.progress + dewEarned);
        } else if (ach.id === 'high_flyer') {
          newProgress = Math.max(ach.progress, score);
        } else if (ach.id === 'master_navigator') {
          newProgress = Math.max(ach.progress, score);
        } else if (ach.id === 'fashionista') {
          const unlockedSkinsCount = skins.filter((s) => s.unlocked).length;
          newProgress = unlockedSkinsCount;
        }
        
        const isNowUnlocked = newProgress >= ach.maxProgress;
        if (isNowUnlocked && !ach.unlocked) {
          setDewDrops((d) => d + ach.reward);
          soundManager.playPowerup();
          confetti({ particleCount: 80, spread: 60 });
        }
        
        return {
          ...ach,
          progress: newProgress,
          unlocked: ach.unlocked || isNowUnlocked,
        };
      })
    );
    
    setGameState('gameover');
  };

  const handleBuySkin = (skin: BirdSkin) => {
    if (dewDrops < skin.price || skin.unlocked) return;
    setDewDrops((prev) => prev - skin.price);
    setSkins((prev) =>
      prev.map((s) => (s.id === skin.id ? { ...s, unlocked: true } : s))
    );
    setSelectedSkinId(skin.id);
    soundManager.playPowerup();
    confetti({ particleCount: 50 });
  };

  const handleUpgrade = (upgrade: Upgrade) => {
    const currentPrice = Math.round(upgrade.basePrice * Math.pow(upgrade.multiplier, upgrade.level));
    if (dewDrops < currentPrice || upgrade.level >= upgrade.maxLevel) return;
    
    setDewDrops((prev) => prev - currentPrice);
    setUpgrades((prev) =>
      prev.map((u) => (u.id === upgrade.id ? { ...u, level: u.level + 1 } : u))
    );
    soundManager.playPowerup();
  };

  return (
    <div className="relative min-h-screen bg-background text-text overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Global Header */}
      <Header
        gameState={gameState}
        setGameState={setGameState}
        dewDrops={dewDrops}
        muted={muted}
        toggleMute={toggleMute}
      />
      
      {/* Dynamic Views */}
      {gameState === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          onOpenShop={() => setGameState('shop')}
          onOpenAchievements={() => setGameState('achievements')}
          selectedSkin={selectedSkin}
          highScore={highScore}
        />
      )}
      
      {gameState === 'playing' && (
        <GameCanvas
          selectedSkin={selectedSkin}
          upgrades={upgrades}
          onGameOver={handleGameOver}
          onUpdateScore={setCurrentScore}
        />
      )}
      
      {gameState === 'gameover' && (
        <>
          <GameCanvas
            selectedSkin={selectedSkin}
            upgrades={upgrades}
            onGameOver={() => {}}
            onUpdateScore={() => {}}
          />
          <GameOverModal
            score={currentScore}
            highScore={highScore}
            dewCollected={dewCollectedThisRun}
            selectedSkin={selectedSkin}
            onRestart={handleStartGame}
            onGoHome={() => setGameState('menu')}
            onOpenShop={() => setGameState('shop')}
          />
        </>
      )}
      
      {gameState === 'shop' && (
        <Shop
          skins={skins}
          upgrades={upgrades}
          dewDrops={dewDrops}
          selectedSkinId={selectedSkinId}
          onSelectSkin={setSelectedSkinId}
          onBuySkin={handleBuySkin}
          onUpgrade={handleUpgrade}
          onClose={() => setGameState('menu')}
        />
      )}
      
      {gameState === 'achievements' && (
        <AchievementsModal
          achievements={achievements}
          onClose={() => setGameState('menu')}
        />
      )}
    </div>
  );
}

export default App;
