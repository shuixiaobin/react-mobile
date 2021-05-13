import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/class/addInfo',
  title: '补充信息',
  component: dynamicWrapper(app, [], () => import('./root'))
});

export default app => createRoute(app, routesConfig);
