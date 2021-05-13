import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import ListContainer from '@/components/ListContainer/root'
import MationListItem from './listItem/root'
import { getArticleList, getArticleTagList } from '@/services/listService'
import { SearchResultNews } from '@/utils/setSensors'

class MationList extends Component {
  state = {}

  componentDidMount() {
    this.initList()
  }

  componentWillReceiveProps(nextProps) {
    const { filterType, keyWord } = this.props

    if (keyWord !== nextProps.keyWord) {
      this.listView.onRefresh()
    }

    if (
      JSON.stringify(nextProps.filterType) !== '{}' &&
      filterType !== nextProps.filterType
    ) {
      this.listView.onRefresh()
    }
  }

  /**
   * 初始化 listview
   */
  initList = () => {
    const { dispatch } = this.props
    dispatch({type: 'information/getFilterList'}).then(res=>{
         //url上没有带参数的时候,触发initList。带参数的情况自动触发列表查询
        if(window.location.hash.indexOf('&name=') > -1) return;
        console.log("咋回事啊啊:",getQueryStr('name'))
        this.onRefresh().then(() => {
          this.listView.initList()
        })
    }) 
  }

  /**
   * 下拉刷新
   */
  onRefresh = () => {
    const { dispatch } = this.props

    return dispatch({ type: 'listView/resetList' }).then(() =>
      this.onEndReached()
    )
  }

  /**
   * 上拉加载
   */
  onEndReached = () => {
    const {
      isFromTagPage, // 是否是从tag页面打开
      isFromTagPageTitle, // tagname
      dispatch,
      filterType,
      keyWord = ''
    } = this.props
    const api = isFromTagPage ? getArticleTagList : getArticleList;
    console.log(filterType)
    
    const params = isFromTagPage
      ? { tagName: isFromTagPageTitle }
      : {
          ...Object.keys(filterType).reduce(
            (last, item) => ({ ...last, [item]: filterType[item].k }),
            {}
          ),
          keyWord
        }

    return dispatch({
      type: 'listView/fetchList',
      payload: {
        api,
        params
      }
    })
  }

  /**
   * 埋点
   */
  track = r => {
    const { pageNumber, keyWord, inforList } = this.props
    const { title, id } = r
    SearchResultNews({
      page_number: pageNumber - 1,
      article_kind: '热门资讯',
      search_keyword: keyWord,
      click_number: inforList.findIndex(item => item.id === id) + 1,
      article_title: title,
      article_id: id
    })
  }

  /**
   * 资讯详情
   */
  toMationDetail = r => () => {
    const { id, title,date} = r
    const { dispatch, keyWord} = this.props

    // 点击资讯搜索结果埋点
    if (keyWord) {
      this.track(r)
    }

    dispatch(
      routerRedux.push({
        pathname: '/other/informationDetail',
        search: qs.stringify({
          id,
          date
        })
      })
    )
  }

  render() {
    return (
      <ListContainer
        triggerRef={ref => {
          this.listView = ref
        }}
        handleRefresh={this.onRefresh}
        handleEndReached={this.onEndReached}
        isDisableScroll
        {...this.props}
      >
        <MationListItem toMationDetail={this.toMationDetail} />
      </ListContainer>
    )
  }
}

const mapState = state => ({
  filterType: state.information.filterType,
  keyWord: state.all.keyWord,
  pageNumber: state.listView.page,
  inforList: state.listView.list
})

export default connect(mapState)(MationList)
