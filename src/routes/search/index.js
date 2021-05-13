import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/search',
  title: '搜索',
  component: dynamicWrapper(
    app,
    () => [
      import('./model'),
      import('../../components/ListContainer/model'),
      import('../information/model'),
      import('../noteEssence/model')
    ],
    () => import('./root')
  )
})

export default app => createRoute(app, routesConfig)
