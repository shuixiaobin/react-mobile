import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/class/buyBackGrp',
  title: '下单结果',
  component: dynamicWrapper(app, [], () => import('./group'))
});

export default app => createRoute(app, routesConfig);
