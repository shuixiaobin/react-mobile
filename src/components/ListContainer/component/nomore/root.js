import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import list from '../../ListContainer.less'

class AllNomore extends Component {
  state = {}

  render() {
    const { myUrl, defaultStyle } = this.props

    return (
      <div className={list.allnomore} style={defaultStyle}>
        <div>
          <img src={`${myUrl}all-nomore.png`} alt="" />
          <p className="f28">没有更多内容哦～</p>
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  myUrl: state.all.myUrl
})

export default connect(mapState)(AllNomore)
