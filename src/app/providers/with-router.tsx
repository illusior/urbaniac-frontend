import { RouterProvider } from 'react-router-dom';
import { createRouter } from './router';

export const withRouter = (provided: () => React.ReactNode) => () => {
  return (
    <RouterProvider
      future={{ v7_startTransition: true }}
      router={createRouter(provided())}
    />
  );
};
