import compose from 'compose-function';
import { withStrict } from './with-strict';

export const withProviders = compose(
  withStrict,
);
