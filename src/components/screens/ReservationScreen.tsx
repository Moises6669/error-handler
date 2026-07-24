import { useState } from 'react';
import type { ReservationData } from '../App';
import styles from './ReservationScreen.module.css';

interface Props {
  onNext: (data: ReservationData) => void;
}

export default function ReservationScreen({ onNext }: Props) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!date || !time) return;
    setLoading(true);
    setTimeout(() => {
      onNext({ date, time });
    }, 2000);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <p className={`${styles.loadingText} mono`}>Confirmando reserva...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>📅</div>
        <h1 className={styles.title}>Reserva tu primera cita</h1>
        <p className={styles.subtitle}>Selecciona la fecha y hora que prefieras.</p>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>📅 Fecha</label>
            <input
              type="date"
              className={styles.input}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>🕒 Hora</label>
            <input
              type="time"
              className={styles.input}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <button
          className={`${styles.button} ${(!date || !time) ? styles.disabled : ''}`}
          onClick={handleSubmit}
          disabled={!date || !time}
        >
          Confirmar reserva
        </button>
      </div>
    </div>
  );
}
