import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/other/userCenter',
  title: '个人中心',
  component: dynamicWrapper(app, () => [import('./model')], () => import('./root'))
})

export default app => createRoute(app, routesConfig)
