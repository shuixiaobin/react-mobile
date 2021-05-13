import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/courseCard',
  title: '激活课程卡',
  component: dynamicWrapper(
    app,[],() => import('./root')
  )
})

export default app => createRoute(app, routesConfig)
