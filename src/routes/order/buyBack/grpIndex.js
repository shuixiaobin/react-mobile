import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/class/buyBackGrp',
  title: 'δΈεη»ζ',
  component: dynamicWrapper(app, [], () => import('./group'))
});

export default app => createRoute(app, routesConfig);
