import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/other/addressList',
  title: '地址管理',
  component: dynamicWrapper(app, [], () => import('./root'))
});

export default app => createRoute(app, routesConfig);
