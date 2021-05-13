import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/other/myInfo',
  title: '账号管理',
  component: dynamicWrapper(app, [], () => import('./root'))
});

export default app => createRoute(app, routesConfig);
