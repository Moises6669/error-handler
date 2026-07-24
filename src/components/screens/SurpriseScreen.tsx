import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import styles from './SurpriseScreen.module.css';

interface Props {
  onNext: () => void;
}

export default function SurpriseScreen({ onNext }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Glitch effect then reveal
    const timer = setTimeout(() => {
      setShow(true);
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b6b', '#ee5a24', '#f8a5c2', '#fd79a8', '#e17055'],
      });
      // Second burst
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff6b6b', '#f8a5c2', '#fd79a8'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff6b6b', '#f8a5c2', '#fd79a8'],
        });
      }, 300);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      {!show && <div className={styles.glitch}>Cargando...</div>}
      {show && (
        <div className={styles.content}>
          <p className={styles.oops}>¡Ups! 😄</p>
          <p className={styles.text}>El error nunca existió...</p>
          <p className={styles.text}>La verdadera prueba era otra.</p>

          <div className={styles.heart}>❤️</div>

          <h1 className={styles.title}>Bienvenida a nuestra primera cita</h1>

          <p className={styles.invite}>
            Me gustaría invitarte oficialmente a nuestra primera cita.
          </p>

          <p className={styles.question}>¿Te gustaría aceptar?</p>

          <div className={styles.buttons}>
            <button className={styles.button} onClick={onNext}>
              ❤️ Sí
            </button>
            <button className={styles.button} onClick={onNext}>
              🥰 Claro que sí
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
