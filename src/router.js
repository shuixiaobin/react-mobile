import { createRoutes } from '@/utils/core'
import Container from '@/routes/container'
import ClassContainer from '@/routes/container/classContainer'
import otherContainer from '@/routes/container/otherContainer'
import searchContainer from '@/routes/container/searchContainer'
import userContainer from '@/routes/container/userContainer'
import Home from '@/routes/home'
import ClassDetail from '@/routes/classDetail'
import AfterClass from '@/routes/afterClass'
import playerRoom from '@/routes/playerRoom'
import addressList from '@/routes/address/list'
import addressAdd from '@/routes/address/add'
import myInfo from '@/routes/address/myInfo'
import CollectList from '@/routes/collectList'
import UserCenter from '@/routes/user'
import password from '@/routes/user/password'
import agreement from '@/routes/user/agreement'
import informationList from '@/routes/information'
import informationDetail from '@/routes/informationDetail'
import noteEssence from '@/routes/noteEssence'
import noteEssenceDetail from '@/routes/noteEssenceDetail'
import search from '@/routes/search'
import buy from '@/routes/order/buy/index.js'
import buyGroup from '@/routes/order/buy/grpIndex.js'
import orderList from '@/routes/order/list'
import orderDetail from '@/routes/order/detail'
import orderNotice from '@/routes/order/notice'
import buyBack from '@/routes/order/buyBack/index'
import buyBackGrp from '@/routes/order/buyBack/grpIndex.js'
import userInforCard from '@/routes/userInforCard'
import myClass from '@/routes/myClass'
import tag from '@/routes/tag'
import groupBuy from '@/routes/groupBuy'

import addInfo from '@/routes/order/addInfo'
import agreeRefund from '@/routes/order/agreeRefund'


/* 课程卡h5需求相关 */
import card_h5 from '@/routes/courseCard/h5'
import card_addressInfo from '@/routes/courseCard/addressInfo'
import card_addressEdit from '@/routes/courseCard/addressEdit'
import card_result from '@/routes/courseCard/result'

// 拼团
import groupClass from '@/routes/groupClass'

/**
 * 主路由配置
 *
 * path 路由地址
 * component 组件
 * indexRoute 默认显示路由
 * childRoutes 所有子路由
 * NotFound 路由要放到最下面，当所有路由当没匹配到时会进入这个页面
 */
const routesConfig = app => [
  {
    path: '/user',
    title: '一对一学员信息卡',
    component: userContainer,
    childRoutes: [
      userInforCard.signup(app), 
      userInforCard.onetoone(app), 
      userInforCard.signupnew(app), 
      userInforCard.signresult(app),
      userInforCard.resign(app)
    ]
  },
  {
    path: '/search',
    title: '搜索',
    component: searchContainer,
    childRoutes: [search(app)]
  },
  {
    path: '/other',
    title: '个人中心',
    component: otherContainer,
    indexRoute: '/other/userCenter',
    childRoutes: [
      UserCenter(app),
      informationList(app),
      informationDetail(app),
      noteEssence(app),
      noteEssenceDetail(app),
      CollectList(app),
      addressList(app),
      addressAdd(app),
      myInfo(app),
      tag(app),
      password(app),
      agreement(app)
    ]
  },
  {
    path: '/class',
    title: '课程详情',
    component: ClassContainer,
    indexRoute: '/class/classDetail',
    childRoutes: [
      ClassDetail(app),
      AfterClass(app),
      buy(app),
      buyGroup(app),
      orderDetail(app),
      orderList(app),
      myClass(app),
      orderNotice(app),
      buyBack(app),
      groupBuy(app),
      buyBackGrp(app),
      groupClass(app),
      addInfo(app),
      agreeRefund(app)
    ]
  },
  /* 课程卡h5需求相关 */
  {
    path: '/courseCard',
    title: '课程卡',
    component: card_h5
  },
  {
    path: '/player',
    title: '课程卡',
    component: playerRoom
  },
  {
    path: '/addressInfo',
    title: '地址列表',
    component: card_addressInfo
  },
  {
    path: '/addressEdit',
    title: '地址管理',
    component: card_addressEdit
  },
  {
    path: '/courseCardResult',
    title: '兑换结果',
    component: card_result
  },
  /* 课程卡h5需求相关 */

  {
    // home要走末级匹配规则
    path: '/',
    title: '公务员考试_事业单位考试_华图在线手机站',
    component: Container,
    indexRoute: '/home',
    childRoutes: [Home(app)]
  }
]

export default app => createRoutes(app, routesConfig)
