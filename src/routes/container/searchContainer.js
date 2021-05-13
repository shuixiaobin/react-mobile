import { connect } from 'dva'
import React from 'react'
import { Switch } from 'dva/router'
import SearchHeader from './components/searchHeader/root'
import Loading from '@/components/loading/root'
import Login from '@/components/loginIn'

function SearchContainer(props) {
  const { routerData } = props
  const { childRoutes } = routerData
  return (
    <>
      <SearchHeader {...props} />
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

export default connect(mapState)(SearchContainer)
