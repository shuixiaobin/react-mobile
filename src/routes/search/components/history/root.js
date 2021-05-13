import { connect } from 'dva'
import React, { Component } from 'react'
import search from '../../search.less'

class HistorySearch extends Component {
  state = {}

  // 删除全部历史记录
  deleteAllHistoryWords = () => {
    const { dispatch } = this.props

    dispatch({
      type: 'search/setHistoryWords',
      payload: {
        type: 'clear'
      }
    })
  }

  // 删除当前历史记录
  setHistoryWords = my => () => {
    const { dispatch } = this.props

    dispatch({
      type: 'search/setHistoryWords',
      payload: { type: 'remove', value: my }
    })
  }

  updateKeyWord = history => async () => {
    const { dispatch } = this.props

    await dispatch({
      type: 'all/setSearchKeyword',
      payload: {
        keyWord: history
      }
    })

    // 发起搜索请求埋点 (历史)
    await dispatch({
      type: 'search/trackSearchPlease',
      payload: {
        is_recommend_word_used: false,
        is_history_word_used: true,
        search_keyword: history
      }
    })
  }

  render() {
    const { myhistorys } = this.props

    return JSON.stringify(myhistorys) !== '[]' ? (
      <div className={search.history}>
        <div className="oh">
          <h2 className="f28 fl">历史记录</h2>
          <i
            onClick={this.deleteAllHistoryWords}
            className="iconfont iconbianzux2 fr f32"
          />
        </div>
        <div className="oh">
          {myhistorys.map(my => (
            <p className="f28 oh" key={my}>
              <span onClick={this.updateKeyWord(my)}>{my}</span>
              <i
                onClick={this.setHistoryWords(my)}
                className="iconfont iconqingchux fr f32"
              />
            </p>
          ))}
        </div>
      </div>
    ) : null
  }
}

const mapState = state => ({
  myhistorys: state.search.myhistorys || []
})

export default connect(mapState)(HistorySearch)
