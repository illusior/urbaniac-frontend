export enum RouteEnum {
  ERR_404_PAGE = 'ERR_404_PAGE',

  HOME_PAGE = 'HOME_PAGE',

  TEST_CHOOSE_PAGE = 'TEST_CHOOSE_PAGE',
  TEST_MAP_PAGE = 'TEST_MAP_PAGE',
}

export interface Route {
  name?: string | undefined;
  path: string;
  type: RouteEnum;
}

export interface MapPageParams {
  mapName: string;
}

export type KeysOfMapPageParams = keyof MapPageParams;
