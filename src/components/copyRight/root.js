import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import copy from './copyRight.less'

// eslint-disable-next-line react/prefer-stateless-function
class CopyRight extends Component {
  routerReduxToTag = () => {
    const { dispatch } = this.props
    dispatch(routerRedux.push({ pathname: '/other/tag' }))
  }

  render() {
    const { outStyle = {} } = this.props

    return (
      <div id={copy.copyRight} style={outStyle} className="f28">
        <div className={`${copy.top} oh`}>
          <p className={`${copy.line} fl`} />
          <p className="fl mr30 ml30" onClick={() => this.routerReduxToTag()}>
            TAG标签
          </p>
          <p className={`${copy.line} fl`} />
        </div>
        <div className={`${copy.bottom} mt20`}>
          Copyright&copy; 2016-2020 华图在线版权所有(V1.2.0)
        </div>
      </div>
    )
  }
}

export default connect()(CopyRight)
