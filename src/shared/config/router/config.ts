import {
  MapPageParams,
  Route,
  RouteEnum,
} from './types';
import { nameof } from '~/shared/helpers';

export const _ROUTES = new Map<RouteEnum, Route> ([
  [RouteEnum.ERR_404_PAGE, {
    name: 'Not found',
    path: '/not-found',
    type: RouteEnum.ERR_404_PAGE,
  }],

  [RouteEnum.TEST_CHOOSE_PAGE, {
    name: 'Choose test',
    path: '/test',
    type: RouteEnum.TEST_CHOOSE_PAGE,
  }],

  [RouteEnum.TEST_MAP_PAGE, {
    name: 'Map Test',
    path: `/map/:${nameof<MapPageParams>('mapName')}`,
    type: RouteEnum.TEST_MAP_PAGE,
  }],

  [RouteEnum.HOME_PAGE, {
    name: 'Home',
    path: '/',
    type: RouteEnum.HOME_PAGE,
  }],
]);

export const routes = (): Route[] => {
  return Array.from(_ROUTES.values())
    .filter((route: Route) => {
      return route.name !== undefined && route.path !== '' && route.name !== '';
    });
};

export enum AvailableMapNameParamEnum {
  MARI_EL = 'mari-el',
  RUSSIA = 'russia',
  WORLD = 'world',
}

export const isAvailableMapNameParam = (mapName: string): mapName is AvailableMapNameParamEnum => {
  return Object.values(AvailableMapNameParamEnum).some((enumValue: string) => enumValue === mapName);
};
