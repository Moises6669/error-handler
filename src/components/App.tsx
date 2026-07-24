import { useState } from 'react';
import ErrorScreen from './screens/ErrorScreen';
import SurpriseScreen from './screens/SurpriseScreen';
import VerificationScreen from './screens/VerificationScreen';
import MiniGame from './screens/MiniGame';
import TerminalScreen from './screens/TerminalScreen';
import ReservationScreen from './screens/ReservationScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';

export type Screen = 'error' | 'surprise' | 'verification' | 'minigame' | 'terminal' | 'reservation' | 'confirmation';

export interface ReservationData {
  date: string;
  time: string;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('error');
  const [reservation, setReservation] = useState<ReservationData>({ date: '', time: '' });

  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      {screen === 'error' && <ErrorScreen onNext={() => setScreen('surprise')} />}
      {screen === 'surprise' && <SurpriseScreen onNext={() => setScreen('verification')} />}
      {screen === 'verification' && <VerificationScreen onNext={() => setScreen('minigame')} />}
      {screen === 'minigame' && <MiniGame onNext={() => setScreen('terminal')} />}
      {screen === 'terminal' && <TerminalScreen onNext={() => setScreen('reservation')} />}
      {screen === 'reservation' && (
        <ReservationScreen
          onNext={(data) => {
            setReservation(data);
            setScreen('confirmation');
          }}
        />
      )}
      {screen === 'confirmation' && <ConfirmationScreen reservation={reservation} />}
    </div>
  );
}
