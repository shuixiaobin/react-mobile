import { dynamicWrapper, createRoute } from '@/utils/core'

const signupRoutesConfig = app => ({
  path: '/user/signup',
  title: '报名信息',
  component: dynamicWrapper(app, () => [import('./model')], () =>
    import('./root/signup')
  )
})

const onetooneRoutesConfig = app => ({
  path: '/user/onetoone',
  title: '一对一学员信息卡',
  component: dynamicWrapper(app, () => [import('./model')], () =>
    import('./root/onetoone')
  )
})

const signupnewRoutesConfig = app => ({
  path: '/user/signupnew',
  title: '报名信息',
  component: dynamicWrapper(app, () => [import('./model')], () =>
    import('./root/signupnew')
  )
})

const signresultRoutesConfig = app => ({
  path: '/user/signresult',
  title: '结果验证',
  component: dynamicWrapper(app, () => [import('./model')], () =>
    import('./root/signresult')
  )
})

const reSignRoutesConfig = app => ({
  path: '/user/resign',
  title: '签订协议',
  component: dynamicWrapper(app, () => [import('./model')], () =>
    import('./root/resign')
  )
})

export default {
  signup: app => createRoute(app, signupRoutesConfig),
  onetoone: app => createRoute(app, onetooneRoutesConfig),
  signupnew: app => createRoute(app, signupnewRoutesConfig),
  signresult: app => createRoute(app, signresultRoutesConfig),
  resign: app => createRoute(app, reSignRoutesConfig)
}
