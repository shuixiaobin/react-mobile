import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/courseCardResult',
  title: '下单结果',
  component: dynamicWrapper(app, [], () => import('./root'))
});

export default app => createRoute(app, routesConfig);
