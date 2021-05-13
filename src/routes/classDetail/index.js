import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/class/classDetail',
  title: '课程详情',
  component: dynamicWrapper(
    app,
    () => [import('./model'), import('../../components/ListContainer/model')],
    () => import('./root')
  )
})

export default app => createRoute(app, routesConfig)
