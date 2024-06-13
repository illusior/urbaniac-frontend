import './index.css';
import { Outlet } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { Suspense } from 'react';
import { withProviders } from './providers';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    {withProviders(() => (
      <Suspense fallback={<p>Loading...</p>}>
        <Outlet />
      </Suspense>
    ),
    )()}
  </>,
);
