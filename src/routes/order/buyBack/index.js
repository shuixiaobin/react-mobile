import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/class/buyBack',
  title: '下单结果',
  component: dynamicWrapper(app, [], () => import('./root'))
});

export default app => createRoute(app, routesConfig);
