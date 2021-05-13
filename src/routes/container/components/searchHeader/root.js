import React from 'react'
import { connect } from 'dva'
import { routerRedux, withRouter } from 'dva/router'
import header from '../header.less'

class SearchHeader extends React.Component {
  state = { keyWord: '' }

  // eslint-disable-next-line react/sort-comp
  componentWillReceiveProps(nextProps) {
    const { keyWord } = this.props
    if (nextProps.keyWord && keyWord !== nextProps.keyWord) {
      const { dispatch } = this.props

      dispatch({
        type: 'search/setHistoryWords',
        payload: {
          type: 'add',
          value: nextProps.keyWord
        }
      })

      this.setState({ keyWord: nextProps.keyWord }, () => {
        // 发起搜索请求埋点（关键词）
        dispatch({
          type: 'search/trackSearchPlease',
          payload: {
            is_recommend_word_used: false,
            is_history_word_used: false,
            search_keyword: nextProps.keyWord
          }
        })
      })
    }
  }

  componentDidMount() {
    const { keyWord } = this.props

    if (keyWord) this.setState({ keyWord })
  }

  // eslint-disable-next-line react/sort-comp
  async goBack() {
    const { dispatch } = this.props

    await this.clearSearchState()

    // 重置搜索类型
    await dispatch({
      type: 'search/SET_ACTIVETAB_INDEX',
      payload: {
        activeTabIndex: ''
      }
    })

    // 重置搜索类型
    await dispatch({
      type: 'search/changeSearchType',
      payload: {
        searchType: '课程'
      }
    })

    await dispatch(routerRedux.push({ pathname: '/home' }))
  }

  /**
   * 清空搜索框，统一重置数据
   */
  clearSearchState = () => {
    const { dispatch } = this.props

    this.setState({ keyWord: '' }, async () => {
      const {
        location: { pathname }
      } = this.props
      const needClearMaps = [
        {
          // 清空搜索关键词
          type: 'all/setSearchKeyword',
          payload: {
            keyWord: ''
          }
        },
        {
          // 清空用户行为
          type: 'all/SET_PAGE_INFO',
          payload: {
            path: pathname
          }
        },
        {
          // 清空热门资讯 model state
          type: 'information/CLEAR_INFOR_STATE'
        }
      ]

      // eslint-disable-next-line no-restricted-syntax
      for await (const { type, payload = '' } of needClearMaps) {
        dispatch({
          type,
          payload
        })
      }
    })
  }

  updateState = e => {
    const keyWord = e.target.value.trim()

    this.setState({
      keyWord
    })
  }

  enterUpdateState = async e => {
    const { dispatch } = this.props
    const { keyWord } = this.state

    if (e.which === 13) {
      await dispatch({
        type: 'all/setSearchKeyword',
        payload: {
          keyWord
        }
      })
    }
  }

  render() {
    const { keyWord } = this.state

    return (
      <div
        id={header.global_header}
        data-header="global_header"
        className={`${header.class_detail}`}
      >
        <span
          onClick={this.goBack.bind(this)}
          className={`${header.back} iconfont icondafanhuix f40`}
        />
        <div className={header.searchInp}>
          <i className={`${header.searchIcon} iconfont iconShapex- f32`} />
          <form action="javascript:return true">
            <input
              id="search"
              className="f28 db"
              type="search"
              placeholder="搜索"
              autoComplete="off"
              onClick={() => {
              const { dispatch } = this.props
              // 点击搜索框埋点
              dispatch({
                type: 'search/trackClickSearchBar'
              })
            }}
              onKeyDown={this.enterUpdateState}
              onChange={this.updateState}
              value={keyWord}
            // eslint-disable-next-line no-return-assign
              ref={myInput => (this.myInput = myInput)}
            />
          </form>
          <i
            onClick={this.clearSearchState}
            className={`${header.searchClose} iconfont iconqingchux f32`}
          />
        </div>
        <div onClick={this.goBack.bind(this)} className="f32">
          取消
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  keyWord: state.all.keyWord
})

export default withRouter(connect(mapState)(SearchHeader))
