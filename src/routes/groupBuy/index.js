import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/class/group',
  title: '开团详情',
  component: dynamicWrapper(
      app,[],
      () => import('./root')
    )
});

export default app => createRoute(app, routesConfig);
