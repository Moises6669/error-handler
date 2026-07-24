import styles from './ErrorScreen.module.css';

interface Props {
  onNext: () => void;
}

export default function ErrorScreen({ onNext }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>⚡</span>
        <span className={styles.logoText}>SysCheck</span>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Alejandra Not Found</h2>

        <div className={`${styles.errorCode} mono`}>
          Código de error: <span>GF_001</span>
        </div>

        <p className={styles.description}>
          No se logró cargar correctamente a Alejandra.
        </p>
        <p className={styles.description}>
          Parece que ocurrió un error inesperado durante la carga.
        </p>
        <p className={styles.hint}>
          Si el problema persiste, presione <strong>Reintentar</strong> para volver a intentar la carga.
        </p>

        <button className={styles.button} onClick={onNext}>
          🔄 Reintentar
        </button>
      </div>
    </div>
  );
}
