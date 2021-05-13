import { connect } from 'dva'
import React from 'react'
import { withRouter } from 'dva/router'

function MiddleWare(props) {
  const { children } = props
  const childrenWithProps = React.Children.map(children, r =>
    React.cloneElement(r, {})
  )

  return <div id="ht_middleware-wrap">{childrenWithProps}</div>
}

const mapState = state => ({
  pageInfos: state.all.pageInfos
})

export default withRouter(connect(mapState)(MiddleWare))
