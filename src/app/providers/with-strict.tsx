import { StrictMode } from 'react';

export const withStrict = (provided: () => React.ReactNode) => () => {
  return (
    <StrictMode>
      {provided()}
    </StrictMode>
  );
};
