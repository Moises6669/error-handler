import { useState } from 'react';
import styles from './VerificationScreen.module.css';

interface Props {
  onNext: () => void;
}

export default function VerificationScreen({ onNext }: Props) {
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => onNext(), 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🔐</div>
        <h1 className={styles.title}>Verificando identidad...</h1>
        <p className={styles.text}>
          Para confirmar que realmente eres Alejandra necesitamos una última prueba.
        </p>
        <p className={styles.text}>
          Completa la misión para desbloquear la reserva.
        </p>

        {!loading ? (
          <button className={styles.button} onClick={handleStart}>
            🚀 Comenzar misión
          </button>
        ) : (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Preparando misión...</p>
          </div>
        )}
      </div>
    </div>
  );
}
