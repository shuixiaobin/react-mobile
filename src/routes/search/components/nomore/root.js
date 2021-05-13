import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import search from '../../search.less'

class NoMore extends Component {
  state = {}

  render() {
    const { myUrl, keyWord, defaultStyle } = this.props
    
    return (
      <div className={search.nomore} style={defaultStyle}>
        <div>
          <img src={`${myUrl}search-nomore.png`} alt="" />
          <p className="f28">未搜索到“{keyWord}”相关的内容</p>
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  myUrl: state.all.myUrl,
  keyWord: state.all.keyWord
})

export default connect(mapState)(NoMore)
