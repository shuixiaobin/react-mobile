import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import ListContainer from '@/components/ListContainer/root'
import NoteListItem from './listItem/root'
import { getNoteList } from '@/services/listService'
import { SearchResultNews } from '@/utils/setSensors'

class NoteList extends Component {
  state = {}

  componentDidMount() {
    const { type } = this.props
    if (type) this.initList()
  }

  componentWillReceiveProps(nextProps) {
    const { keyWord, type } = this.props

    if (keyWord !== nextProps.keyWord || type !== nextProps.type) {
      this.listView.onRefresh()
    }
  }

  /**
   * 初始化 listview
   */
  initList = () => {
    this.onRefresh().then(() => {
      this.listView.initList()
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
    const { dispatch, type, keyWord = '' } = this.props

    return dispatch({
      type: 'listView/fetchList',
      payload: {
        api: getNoteList,
        params: { type, keyWord }
      }
    })
  }

  /**
   * 埋点
   */
  track = r => {
    const { pageNumber, keyWord, noteList } = this.props
    const { title, id } = r
    SearchResultNews({
      page_number: pageNumber - 1,
      article_kind: '备考精华',
      search_keyword: keyWord,
      click_number: noteList.findIndex(item => item.id === id) + 1,
      article_title: title,
      article_id: id
    })
  }

  /**
   * 资讯详情
   */
  toNoteDetail = r => () => {
    const { id, title } = r
    const { dispatch, keyWord } = this.props

    // 点击资讯搜索结果埋点
    if (keyWord) {
      this.track(r)
    }

    dispatch(
      routerRedux.push({
        pathname: '/other/noteEssenceDetail',
        search: qs.stringify({
          id
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
        <NoteListItem toNoteDetail={this.toNoteDetail} />
      </ListContainer>
    )
  }
}

const mapState = state => ({
  type: state.noteEssence.type,
  keyWord: state.all.keyWord,
  pageNumber: state.listView.page,
  noteList: state.listView.list
})

export default connect(mapState)(NoteList)
