import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/other/addAddress',
  title: '新增收货地址',
  component: dynamicWrapper(app, [], () => import(/* webpackChunkName: "foo" */'./root'))
});

export default app => createRoute(app, routesConfig);
