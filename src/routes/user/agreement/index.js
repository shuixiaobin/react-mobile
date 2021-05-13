import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/other/agreement',
  title: '用户服务协议',
  component: dynamicWrapper(app, [], () => import('./root'))
})

export default app => createRoute(app, routesConfig)
