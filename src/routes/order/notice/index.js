import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/class/notice',
  title: '购课须知',
  component: dynamicWrapper(app, [], () => import('./root'))
});

export default app => createRoute(app, routesConfig);
