import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/class/afterClass',
  title: '课程详情',
  component: dynamicWrapper(
    app,
    () => [import('./model')],
    () => import('./root')
  )
})

export default app => createRoute(app, routesConfig)
