import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { ReservationData } from '../App';
import styles from './ConfirmationScreen.module.css';

interface Props {
  reservation: ReservationData;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${day} ${months[parseInt(month) - 1]} ${year}`;
}

function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

export default function ConfirmationScreen({ reservation }: Props) {
  useEffect(() => {
    // Celebration confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#667eea', '#764ba2', '#f093fb'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#667eea', '#764ba2', '#f093fb'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.ticket}>
        <div className={styles.ticketHeader}>
          <span className={styles.celebration}>🎉</span>
          <h1 className={styles.title}>Reserva Confirmada</h1>
        </div>

        <div className={styles.ticketBody}>
          <div className={styles.ticketRow}>
            <span className={styles.ticketLabel}>Ticket</span>
            <span className={`${styles.ticketValue} mono`}>#000001</span>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.ticketRow}>
            <span className={styles.ticketLabel}>Estado</span>
            <span className={styles.confirmed}>CONFIRMADA ✓</span>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.ticketRow}>
            <span className={styles.ticketLabel}>📅 Fecha</span>
            <span className={styles.ticketValue}>{formatDate(reservation.date)}</span>
          </div>

          <div className={styles.ticketRow}>
            <span className={styles.ticketLabel}>🕒 Hora</span>
            <span className={styles.ticketValue}>{formatTime(reservation.time)}</span>
          </div>
        </div>

        <div className={styles.ticketFooter}>
          <p className={styles.message}>
            Gracias por aceptar esta invitación.
          </p>
          <p className={styles.message}>
            Prometo hacer todo lo posible para que sea una cita bonita, divertida y un recuerdo que ambos podamos guardar con cariño. ❤️
          </p>
        </div>
      </div>

      <div className={styles.instructions}>
        <p className={styles.screenshot}>
          📸 <strong>Por favor tome captura de esta reserva y envíesela al creador para confirmar la asistencia.</strong>
        </p>
      </div>

      <div className={`${styles.footer} mono`}>
        <p>FirstDate v1.0</p>
        <p className={styles.status}>Deploy Successful ❤️</p>
      </div>
    </div>
  );
}
