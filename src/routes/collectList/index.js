import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/other/collectList',
  title: '合集',
  component: dynamicWrapper(
    app,
    () => [import('@/components/ListContainer/model')],
    () => import('./root')
  )
})

export default app => createRoute(app, routesConfig)
