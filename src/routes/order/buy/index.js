import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/class/buy',
  title: '下单',
  component: dynamicWrapper(app, () => [import('@/routes/classDetail/model')], () => import('./root'))
});

export default app => createRoute(app, routesConfig);
