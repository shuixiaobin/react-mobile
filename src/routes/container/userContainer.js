import { connect } from 'dva'
import React from 'react'
import { Switch } from 'dva/router'
import UserHeader from './components/userHeader/root'
import Loading from '@/components/loading/root'
import Login from '@/components/loginIn'

function ClassContainer(props) {
  const { routerData } = props
  const { childRoutes } = routerData

  return (
    <>
      <UserHeader {...props} />
      <Loading>
        <Switch>{childRoutes}</Switch>
      </Loading>
      <Login />
    </>
  )
}

function mapState(state) {
  return {
    myUrl: state.all.myUrl
  }
}

export default connect(mapState)(ClassContainer)
