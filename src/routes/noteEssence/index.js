import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/other/noteEssence',
  title: '备考精华',
  component: dynamicWrapper(
    app,
    () => [import('./model'), import('@/components/ListContainer/model')],
    () => import('./root')
  )
})

export default app => createRoute(app, routesConfig)
