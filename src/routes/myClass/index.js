import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/class/myClass',
  title: '我的课程',
  component: dynamicWrapper(
    app,
    () => [import('./model'), import('../../components/ListContainer/model')],
    () => import('./root')
  )
})

export default app => createRoute(app, routesConfig)
