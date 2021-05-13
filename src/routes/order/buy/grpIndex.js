import { dynamicWrapper, createRoute } from '@/utils/core';

/* 拼团下单 */
const routesConfig = app => ({
  path: '/class/buyGroup',
  title: '下单',
  component: dynamicWrapper(app, () => [import('@/routes/classDetail/model')], () => import('./group'))
});

export default app => createRoute(app, routesConfig);
