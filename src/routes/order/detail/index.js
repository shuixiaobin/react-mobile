import { dynamicWrapper, createRoute } from '@/utils/core'

const routesConfig = app => ({
  path: '/class/orderDetail',
  title: '订单详情',
  component: dynamicWrapper(app, () => [import('../../classDetail/model')], () =>
    import('./root')
  )
})

export default app => createRoute(app, routesConfig)
