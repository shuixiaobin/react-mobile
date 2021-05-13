import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/other/informationList',
  title: '热门资讯',
  component: dynamicWrapper(
    app,
    () => [import('./model'), import('../../components/ListContainer/model')],
    () => import('./root')
  )
})

export default app => createRoute(app, routesConfig)
