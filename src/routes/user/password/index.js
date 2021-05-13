import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/other/password',
  title: '找回密码',
  component: dynamicWrapper(app, [], () => import('./root'))
})

export default app => createRoute(app, routesConfig)
