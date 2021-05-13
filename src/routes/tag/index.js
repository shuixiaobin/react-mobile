import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/other/tag',
  title: 'TAG标签',
  component: dynamicWrapper(app, () => [import('./model')], () => import('./root'))
})

export default app => createRoute(app, routesConfig)
