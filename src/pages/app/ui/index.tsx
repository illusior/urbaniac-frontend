/* eslint-disable @typescript-eslint/no-misused-promises */
import reactLogo from '~/shared/assets/icons/react.svg';
import styles from './styles.module.css';
import { useState } from 'react';
import { useUserStore } from '~/entities/user';
import viteLogo from '/vite.svg';

interface AppProps {}

function generateRandomString(length: number): string {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const App: React.FC<AppProps> = (_: AppProps): JSX.Element => {
  const [count, setCount] = useState(0);

  const userStore = useUserStore();

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className={styles.logo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className={`${styles.logo} ${styles.react}`} alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className={styles.card}>
        <button onClick={() => { setCount(count => count + 1); }}>
          count is
          {' '}
          {count}
        </button>
        <button onClick={async () => {
          await userStore.signUp({
            email: `example-${generateRandomString(3)}@a.com`,
            full_name: ' ',
            password: '123_Pass1',
          });
        }}
        >
          Register
          {' '}
          {count}
        </button>
        <p>
          Edit
          {' '}
          <code>src/App.tsx</code>
          {' '}
          and save to test HMR
        </p>
      </div>
      <p className={styles['read-the-docs']}>
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
};
