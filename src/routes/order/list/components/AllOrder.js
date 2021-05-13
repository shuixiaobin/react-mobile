import React, { Component } from 'react'
import ListContainer from '@/components/ListContainer/root'
import { connect } from 'dva'
import OrderItem from './OrderItem'
import { getOrderList } from '@/services/order'

import style from '../list.less'

class AllOrder extends Component {
  componentDidMount() {
    this.listView.onRefresh()
  }

  componentWillReceiveProps(nextProps) {
    const { orderStatus } = this.props
    if (nextProps.orderStatus !== orderStatus) {
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
    const { dispatch, orderStatus, userName } = this.props
    return dispatch({
      type: 'listView/fetchList',
      payload: {
        api: getOrderList,
        params: { chooseStatus: orderStatus, userName, mini :1 }
      }
    })
  }

  render() {
    return (
      <div className={style.allOrder}>
        <ListContainer
          triggerRef={ref => {
            this.listView = ref
          }}
          handleRefresh={this.onRefresh}
          handleEndReached={this.onEndReached}
          isDisableScroll
          {...this.props}
        >
          <OrderItem {...this.props} />
        </ListContainer>
      </div>
    )
  }
}

const mapState = state => ({
  userName: state.all.userName,
  list: state.listView.list,
  orderStatus: state.orderList.orderStatus
})

export default connect(mapState)(AllOrder)
