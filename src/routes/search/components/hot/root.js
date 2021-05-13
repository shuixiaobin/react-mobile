import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import search from '../../search.less'

class HotSearch extends Component {
  state = {}

  updateKeyWord = hot => async () => {
    const { dispatch } = this.props

    await dispatch({
      type: 'all/setSearchKeyword',
      payload: {
        keyWord: hot
      }
    })

    // 发起搜索请求埋点 (热门搜索)
    await dispatch({
      type: 'search/trackSearchPlease',
      payload: {
        is_recommend_word_used: true,
        is_history_word_used: false,
        search_keyword: hot
      }
    })
  }

  render() {
    const { hotwords } = this.props

    return (
      <div className={search.hot}>
        <h2 className="f28">热门搜索</h2>
        <div className="oh">
          {hotwords.map(hot => (
            <p onClick={this.updateKeyWord(hot)} className="f28 fl" key={hot}>
              {hot}
            </p>
          ))}
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  hotwords: state.search.hotwords
})

export default connect(mapState)(HotSearch)
