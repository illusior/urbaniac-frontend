import { AvailableMapNameParam } from '~/shared/config';
import { Navigate } from 'react-router-dom';
import styles from './index.module.css';
import { useState } from 'react';

interface ChooseTestProps {}

export const ChooseTest: React.FC<ChooseTestProps> = (_: ChooseTestProps): JSX.Element => {
  const [test, setTest] = useState<AvailableMapNameParam | null>(null);

  if (test) {
    return <Navigate to={`/map/${test.toString()}`} />;
  }

  return (
    <div className={styles['choose-test-wrapper']}>
      Выбери тест
      <div onClick={() => { setTest(AvailableMapNameParam.MARI_EL); }}>
        Карта Марий Эл
      </div>
      <div onClick={() => { setTest(AvailableMapNameParam.RUSSIA); }}>
        Карта России
      </div>
    </div>
  );
};
