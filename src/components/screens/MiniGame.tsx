import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './MiniGame.module.css';

interface Props {
  onNext: () => void;
}

interface FallingItem {
  id: number;
  emoji: string;
  points: number;
  x: number;
  y: number;
  speed: number;
}

const GAME_DURATION = 25;
const WIN_SCORE = 20;
const PLAYER_WIDTH = 50;
const ITEM_SIZE = 35;

const ITEMS = [
  { emoji: '❤️', points: 1, weight: 5 },
  { emoji: '🌹', points: 2, weight: 3 },
  { emoji: '☕', points: 3, weight: 2 },
  { emoji: '🐞', points: -1, weight: 2 },
];

export default function MiniGame({ onNext }: Props) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'won'>('ready');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [playerX, setPlayerX] = useState(50); // percentage
  const [items, setItems] = useState<FallingItem[]>([]);
  const [showHit, setShowHit] = useState<{ emoji: string; points: number } | null>(null);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const itemIdRef = useRef(0);
  const itemsRef = useRef<FallingItem[]>([]);
  const playerXRef = useRef(50);
  const scoreRef = useRef(0);

  // Keep refs in sync
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { playerXRef.current = playerX; }, [playerX]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const spawnItem = useCallback(() => {
    const totalWeight = ITEMS.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    let selected = ITEMS[0];
    for (const item of ITEMS) {
      random -= item.weight;
      if (random <= 0) {
        selected = item;
        break;
      }
    }

    const newItem: FallingItem = {
      id: itemIdRef.current++,
      emoji: selected.emoji,
      points: selected.points,
      x: Math.random() * 80 + 10, // 10% to 90%
      y: -5,
      speed: 1.2 + Math.random() * 0.8,
    };

    setItems(prev => [...prev, newItem]);
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    if (!lastSpawnRef.current) lastSpawnRef.current = timestamp;

    // Spawn new items every ~800ms
    if (timestamp - lastSpawnRef.current > 800) {
      spawnItem();
      lastSpawnRef.current = timestamp;
    }

    // Move items down and check collisions
    setItems(prev => {
      const surviving: FallingItem[] = [];
      for (const item of prev) {
        const newY = item.y + item.speed;

        // Check collision with player
        const playerLeft = playerXRef.current - 8;
        const playerRight = playerXRef.current + 8;
        const itemCenter = item.x;

        if (newY >= 78 && newY <= 90 && itemCenter >= playerLeft && itemCenter <= playerRight) {
          // Hit!
          setScore(s => {
            const newScore = Math.max(0, s + item.points);
            if (newScore >= WIN_SCORE) {
              setGameState('won');
            }
            return newScore;
          });
          setShowHit({ emoji: item.emoji, points: item.points });
          setTimeout(() => setShowHit(null), 500);
          continue;
        }

        // Remove if off screen
        if (newY > 105) continue;

        surviving.push({ ...item, y: newY });
      }
      return surviving;
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [spawnItem]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setItems([]);
    scoreRef.current = 0;
  };

  // Game timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - but if score is enough, still win
          if (scoreRef.current >= WIN_SCORE) {
            setGameState('won');
          } else {
            // Reset and try again
            setScore(0);
            setTimeLeft(GAME_DURATION);
            setItems([]);
          }
          return GAME_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Animation loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameState, gameLoop]);

  // Touch controls
  const handleTouch = (e: React.TouchEvent) => {
    if (!gameAreaRef.current) return;
    const touch = e.touches[0];
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(8, Math.min(92, x)));
  };

  // Won state
  if (gameState === 'won') {
    return (
      <div className={styles.container}>
        <div className={styles.wonContent}>
          <div className={styles.checkmark}>✅</div>
          <h1 className={styles.wonTitle}>Identidad confirmada</h1>
          <div className={styles.meter}>
            <div className={styles.meterLabel}>Nivel de ternura:</div>
            <div className={styles.meterBar}>
              <div className={styles.meterFill}></div>
            </div>
            <div className={styles.meterValue}>100%</div>
          </div>
          <button className={styles.continueBtn} onClick={onNext}>
            Continuar →
          </button>
        </div>
      </div>
    );
  }

  // Ready state
  if (gameState === 'ready') {
    return (
      <div className={styles.container}>
        <div className={styles.readyContent}>
          <h1 className={styles.readyTitle}>🎮 Misión: Atrapa Corazones</h1>
          <div className={styles.instructions}>
            <p>Desliza tu dedo para mover el personaje</p>
            <div className={styles.legend}>
              <span>❤️ +1</span>
              <span>🌹 +2</span>
              <span>☕ +3</span>
              <span>🐞 -1</span>
            </div>
            <p className={styles.goal}>Meta: {WIN_SCORE} puntos</p>
          </div>
          <button className={styles.startBtn} onClick={startGame}>
            ¡Empezar!
          </button>
        </div>
      </div>
    );
  }

  // Playing state
  return (
    <div className={styles.container}>
      {/* HUD */}
      <div className={styles.hud}>
        <div className={styles.hudItem}>
          <span className={styles.hudLabel}>⏱️</span>
          <span className={styles.hudValue}>{timeLeft}s</span>
        </div>
        <div className={styles.hudItem}>
          <span className={styles.hudLabel}>⭐</span>
          <span className={styles.hudValue}>{score}/{WIN_SCORE}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
        ></div>
      </div>

      {/* Game area */}
      <div
        ref={gameAreaRef}
        className={styles.gameArea}
        onTouchMove={handleTouch}
        onTouchStart={handleTouch}
      >
        {/* Falling items */}
        {items.map(item => (
          <div
            key={item.id}
            className={styles.fallingItem}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Player */}
        <div
          className={styles.player}
          style={{ left: `${playerX}%` }}
        >
          🧺
        </div>

        {/* Hit feedback */}
        {showHit && (
          <div className={styles.hitFeedback}>
            {showHit.emoji} {showHit.points > 0 ? `+${showHit.points}` : showHit.points}
          </div>
        )}
      </div>
    </div>
  );
}
