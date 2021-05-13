import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/other/noteEssenceDetail',
  title: '备考精华详情',
  component: dynamicWrapper(
    app,
    ()=> [import('./model'), import('@/components/ListContainer/model')],
    () => import('./root')
  )
})

export default app => createRoute(app, routesConfig)
