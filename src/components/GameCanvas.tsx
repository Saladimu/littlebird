import React, { useEffect, useRef, useCallback } from 'react';
import { BirdSkin, Upgrade, Particle, Obstacle, Collectible } from '../types';
import { soundManager } from '../utils/audio';

interface GameCanvasProps {
  selectedSkin: BirdSkin;
  upgrades: Upgrade[];
  onGameOver: (score: number, dewEarned: number) => void;
  onUpdateScore: (score: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  selectedSkin,
  upgrades,
  onGameOver,
  onUpdateScore,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const gameStateRef = useRef({
    birdX: 100,
    birdY: 300,
    birdVy: 0,
    gravity: 0.38,
    lift: -7.5,
    score: 0,
    dewEarned: 0,
    gameOver: false,
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    particles: [] as Particle[],
    frame: 0,
    speed: 3.2,
  });

  const magnetUpgrade = upgrades.find((u) => u.id === 'magnet')?.level || 0;
  const dewBonusUpgrade = upgrades.find((u) => u.id === 'dew_bonus')?.level || 0;

  const triggerFlap = useCallback(() => {
    const state = gameStateRef.current;
    if (state.gameOver) return;
    state.birdVy = state.lift;
    soundManager.playFlap();

    // Spawn flap particles
    for (let i = 0; i < 5; i++) {
      state.particles.push({
        x: state.birdX - 10,
        y: state.birdY + 10,
        vx: -2 - Math.random() * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 3 + Math.random() * 4,
        color: selectedSkin.color,
        alpha: 1,
        life: 0,
        maxLife: 20,
      });
    }
  }, [selectedSkin]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        triggerFlap();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerFlap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const state = gameStateRef.current;
    state.birdY = canvas.height / 2;

    // Main Game Loop
    const render = () => {
      if (!canvas || !ctx) return;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear & Background Gradient (Magical Ether Sky)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0f0c29');
      bgGrad.addColorStop(0.5, '#302b63');
      bgGrad.addColorStop(1, '#24243e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw floating background ether stars/dots
      state.frame++;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let i = 0; i < 30; i++) {
        const x = (i * 137 + state.frame * 0.5) % width;
        const y = (i * 89) % height;
        ctx.beginPath();
        ctx.arc(x, y, (i % 3) + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!state.gameOver) {
        // Physics
        state.birdVy += state.gravity;
        state.birdY += state.birdVy;

        // Difficulty scaling speed
        state.speed = 3.2 + Math.floor(state.score / 10) * 0.4;

        // Spawn obstacles
        if (state.frame % 110 === 0) {
          const gapHeight = Math.max(160, 220 - Math.floor(state.score / 5) * 6);
          const minTop = 80;
          const maxTop = height - gapHeight - 140;
          const topHeight = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

          const obsTypes: Array<'crystal' | 'thorn' | 'pillar'> = ['crystal', 'thorn', 'pillar'];
          const obsType = obsTypes[Math.floor(Math.random() * obsTypes.length)];

          state.obstacles.push({
            x: width,
            topHeight,
            bottomY: topHeight + gapHeight,
            width: 70,
            passed: false,
            type: obsType,
            color: obsType === 'crystal' ? '#38bdf8' : obsType === 'thorn' ? '#f472b6' : '#9E7FFF',
          });

          // Spawn Collectible Dew inside gap
          if (Math.random() > 0.3) {
            state.collectibles.push({
              x: width + 35,
              y: topHeight + gapHeight / 2,
              radius: 12,
              collected: false,
              type: 'dew',
              bobOffset: Math.random() * 10,
            });
          }
        }

        // Update obstacles
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
          const obs = state.obstacles[i];
          obs.x -= state.speed;

          // Check scoring
          if (!obs.passed && obs.x + obs.width < state.birdX) {
            obs.passed = true;
            state.score += 1;
            onUpdateScore(state.score);
            soundManager.playCollect();
          }

          // Remove off-screen obstacles
          if (obs.x + obs.width < -50) {
            state.obstacles.splice(i, 1);
          }
        }

        // Update collectibles
        for (let i = state.collectibles.length - 1; i >= 0; i--) {
          const col = state.collectibles[i];
          col.x -= state.speed;

          // Magnet upgrade pull
          const magnetRadius = 60 + magnetUpgrade * 30;
          const dx = state.birdX - col.x;
          const dy = state.birdY - col.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (!col.collected && magnetRadius > 0 && dist < magnetRadius) {
            col.x += dx * 0.12;
            col.y += dy * 0.12;
          }

          // Collision with bird
          if (!col.collected && dist < 24) {
            col.collected = true;
            const earned = 1 + dewBonusUpgrade;
            state.dewEarned += earned;
            soundManager.playCollect();

            // Spawn sparkle particles
            for (let p = 0; p < 8; p++) {
              state.particles.push({
                x: col.x,
                y: col.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                size: 4 + Math.random() * 4,
                color: '#fbbf24',
                alpha: 1,
                life: 0,
                maxLife: 25,
              });
            }
          }

          if (col.x < -50 || col.collected) {
            state.collectibles.splice(i, 1);
          }
        }

        // Collision detection with bounds and obstacles
        const birdRadius = 18;
        if (state.birdY - birdRadius < 0 || state.birdY + birdRadius > height) {
          state.gameOver = true;
          soundManager.playHit();
          onGameOver(state.score, state.dewEarned);
        }

        for (const obs of state.obstacles) {
          if (
            state.birdX + birdRadius > obs.x &&
            state.birdX - birdRadius < obs.x + obs.width
          ) {
            if (
              state.birdY - birdRadius < obs.topHeight ||
              state.birdY + birdRadius > obs.bottomY
            ) {
              state.gameOver = true;
              soundManager.playHit();
              onGameOver(state.score, state.dewEarned);
            }
          }
        }
      }

      // 2. Render Obstacles (Magical Crystal Pillars & Thorns)
      for (const obs of state.obstacles) {
        ctx.save();
        const gradTop = ctx.createLinearGradient(obs.x, 0, obs.x + obs.width, obs.topHeight);
        gradTop.addColorStop(0, obs.color);
        gradTop.addColorStop(1, '#171717');

        ctx.fillStyle = gradTop;
        ctx.shadowColor = obs.color;
        ctx.shadowBlur = 15;

        // Top Pillar
        ctx.beginPath();
        ctx.roundRect(obs.x, 0, obs.width, obs.topHeight, [0, 0, 16, 16]);
        ctx.fill();

        // Bottom Pillar
        const gradBottom = ctx.createLinearGradient(obs.x, obs.bottomY, obs.x + obs.width, height);
        gradBottom.addColorStop(0, '#171717');
        gradBottom.addColorStop(1, obs.color);

        ctx.fillStyle = gradBottom;
        ctx.beginPath();
        ctx.roundRect(obs.x, obs.bottomY, obs.width, height - obs.bottomY, [16, 16, 0, 0]);
        ctx.fill();

        ctx.restore();
      }

      // 3. Render Collectibles (Sun-Dew Drops)
      for (const col of state.collectibles) {
        ctx.save();
        const bobY = col.y + Math.sin(state.frame * 0.08 + col.bobOffset) * 4;
        
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#f59e0b';

        ctx.beginPath();
        ctx.arc(col.x, bobY, col.radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner droplet shine
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(col.x - 3, bobY - 3, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 4. Render Bird
      ctx.save();
      ctx.translate(state.birdX, state.birdY);
      const rot = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, state.birdVy * 0.08));
      ctx.rotate(rot);

      // Glow
      ctx.shadowColor = selectedSkin.glowColor;
      ctx.shadowBlur = 20;

      // Bird body
      const birdGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, 20);
      birdGrad.addColorStop(0, selectedSkin.color);
      birdGrad.addColorStop(1, selectedSkin.secondaryColor);
      ctx.fillStyle = birdGrad;

      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();

      // Wing animation
      ctx.fillStyle = '#ffffff';
      const wingOffset = Math.sin(state.frame * 0.4) * 6;
      ctx.beginPath();
      ctx.ellipse(-4, 2 + wingOffset, 8, 5, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8, -4, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(9, -4, 2, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(14, -1);
      ctx.lineTo(22, 2);
      ctx.lineTo(14, 5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // 5. Render Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          state.particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [selectedSkin, magnetUpgrade, dewBonusUpgrade, onGameOver, onUpdateScore]);

  return (
    <div
      onClick={triggerFlap}
      className="absolute inset-0 z-10 cursor-pointer overflow-hidden select-none"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
