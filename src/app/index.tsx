import './index.css';
import { AppPage } from '~/pages/app';
import ReactDOM from 'react-dom/client';
import { withProviders } from './providers';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    {withProviders(() => (
      <AppPage />
    ),
    )()}
  </>,
);
