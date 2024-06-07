import { RouteEnum } from './types';
import { _ROUTES } from './config';

export const getRoutePath = (route: RouteEnum): string => {
  return _ROUTES.get(route)?.path ?? '';
};

export const getRouteName = (route: RouteEnum): string => {
  return _ROUTES.get(route)?.name ?? '';
};
