import { useState, useEffect } from 'react';
import styles from './TerminalScreen.module.css';

interface Props {
  onNext: () => void;
}

const LINES = [
  { text: '> identity_verified', delay: 0, type: 'command' },
  { text: 'TRUE', delay: 800, type: 'success' },
  { text: '', delay: 1200, type: 'blank' },
  { text: '> preparing_first_date', delay: 1400, type: 'command' },
  { text: 'Loading...', delay: 2000, type: 'normal' },
  { text: '████████████████ 100%', delay: 2800, type: 'progress' },
  { text: '', delay: 3200, type: 'blank' },
  { text: '> compiling_emotions', delay: 3400, type: 'command' },
  { text: 'Success', delay: 4200, type: 'success' },
  { text: '', delay: 4600, type: 'blank' },
  { text: '> creating_reservation', delay: 4800, type: 'command' },
  { text: 'Done', delay: 5600, type: 'success' },
  { text: '', delay: 6000, type: 'blank' },
  { text: '> status', delay: 6200, type: 'command' },
  { text: 'Ready ❤️', delay: 7000, type: 'success' },
];

export default function TerminalScreen({ onNext }: Props) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    LINES.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines(index + 1);
      }, line.delay);
      timers.push(timer);
    });

    // Show continue prompt after all lines
    const finalTimer = setTimeout(() => {
      setShowContinue(true);
    }, 8000);
    timers.push(finalTimer);

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={styles.container} onClick={showContinue ? onNext : undefined}>
      <div className={styles.terminal}>
        <div className={styles.header}>
          <div className={styles.dots}>
            <span className={styles.dot} style={{ background: '#ff5f56' }}></span>
            <span className={styles.dot} style={{ background: '#ffbd2e' }}></span>
            <span className={styles.dot} style={{ background: '#27ca3f' }}></span>
          </div>
          <span className={styles.headerTitle}>terminal</span>
        </div>
        <div className={styles.body}>
          {LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className={`${styles.line} ${styles[line.type]} mono`}
            >
              {line.text}
            </div>
          ))}
          {visibleLines > 0 && <span className={styles.cursor}>▊</span>}
        </div>
      </div>

      {showContinue && (
        <div className={`${styles.continuePrompt} mono`}>
          Presione para continuar...
        </div>
      )}
    </div>
  );
}
