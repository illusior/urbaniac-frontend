import {
  Navigate, createBrowserRouter,
} from 'react-router-dom';
import { RouteEnum } from '~/shared/config';
import { getRoutePath } from '~/shared/config';

const notFound404PageRoutePath = getRoutePath(RouteEnum.ERR_404_PAGE);
const homePageRoutePath = getRoutePath(RouteEnum.HOME_PAGE);
const chooseTestPageRoutePath = getRoutePath(RouteEnum.TEST_CHOOSE_PAGE);

export const createRouter = (mainElement: React.ReactNode) => {
  return createBrowserRouter([
    { // public routes
      children: [
        {
          async lazy() {
            const { HomePage } = await import('~/pages/home');
            return { Component: HomePage };
          },
          path: homePageRoutePath,
        },
        {
          async lazy() {
            const { ChooseTest } = await import('~/pages/choose-test');
            return { Component: ChooseTest };
          },
          path: chooseTestPageRoutePath,
        },
        {
          async lazy() {
            const { TestMapPage } = await import('~/pages/test');
            return { Component: TestMapPage };
          },
          path: getRoutePath(RouteEnum.TEST_MAP_PAGE),
        },
        {
          async lazy() {
            const { NotFoundPage } = await import('~/pages/error');
            return { Component: NotFoundPage };
          },
          path: notFound404PageRoutePath,
        },
      ],
      element: mainElement,
      errorElement: (() => (
        <Navigate
          replace
          to={notFound404PageRoutePath}
        />
      )
      )(),
      path: homePageRoutePath,
    },
  ]);
};
