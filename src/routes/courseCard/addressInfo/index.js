import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/addressInfo',
  title: '地址列表',
  component: dynamicWrapper(app, [], () => import('./root'))
});

export default app => createRoute(app, routesConfig);
