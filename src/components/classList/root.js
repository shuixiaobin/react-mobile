/**
 * 合集，课程列表
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import ListContainer from '../ListContainer/root'
import ClassListItem from './classListItem/root'

class ClassList extends Component {
  componentDidMount() {
    this.initList()
  }

  componentWillReceiveProps(nextProps) {
    const {
      location: { search }
    } = nextProps

    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.location.search !== search) {
      this.initList()
    }
  }

  shouldComponentUpdate(nextProps) {
    const {
      fetchListParams: { cateId },
      keyWord
    } = this.props
    const isKeyWord = nextProps.keyWord && nextProps.keyWord !== keyWord
    const isCateId =
      nextProps.fetchListParams && nextProps.fetchListParams.cateId !== cateId

    if (isKeyWord || isCateId) {
      this.listView.onRefresh()
      return true
    }

    return false
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
    const { dispatch, fetchListApi, fetchListParams } = this.props

    return dispatch({
      type: 'listView/fetchList',
      payload: {
        api: fetchListApi,
        params: fetchListParams
      }
    })
  }

  render() {
    const { myUrl } = this.props

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
        <ClassListItem myUrl={myUrl} {...this.props} />
      </ListContainer>
    )
  }
}

const mapState = state => ({
  myUrl: state.all.myUrl
})

export default connect(mapState)(ClassList)
