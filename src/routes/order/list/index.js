import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/class/orderList',
  title: '订单列表',
  component: dynamicWrapper(
    app,
    () => [import('./model'), import('../../../components/ListContainer/model')],
    () => import('./root')
  )
})

export default app => createRoute(app, routesConfig)
