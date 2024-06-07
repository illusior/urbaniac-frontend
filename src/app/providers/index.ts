import compose from 'compose-function';
import { withRouter } from './with-router';
import { withStrict } from './with-strict';

export const withProviders = compose(
  withStrict,
  withRouter,
);
