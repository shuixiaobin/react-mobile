import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/player',
  title: '华图在线',
  component: dynamicWrapper(
    app,
    () => [],
    () => import('./root')
  )
})

export default app => createRoute(app, routesConfig)
