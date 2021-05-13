import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd-mobile'
import PropTypes from 'prop-types'
import OpenApp from '@/components/openApp/root'
import AllOrder from './components/AllOrder'
import style from './list.less'

class OrderList extends React.Component {
  static contextTypes = {
    wantCustomer: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      tabs: [
        { title: '全部' },
        { title: '待付款' },
        { title: '已支付' },
        { title: '已取消' }
      ],
      underlineLeft: '7.5%'
    }
  }

  componentDidMount() {
    const { dispatch, orderStatus } = this.props
    dispatch({
      type: 'listView/SET_LIST_OPTIONS',
      payload: {
        height: document.documentElement.clientHeight * 0.86,
        isWingBlank: true,
        isPullToRefresh: true,
        isUpToRefresh: true
      }
    })

    switch (orderStatus) {
      case 0:
        this.setState({
          underlineLeft: '7.5%',
          tabIndex: 0
        })
        break
      case 1:
        this.setState({
          underlineLeft: '32.5%',
          tabIndex: 1
        })
        break
      case 2:
        this.setState({
          underlineLeft: '57.5%',
          tabIndex: 2
        })
        break
      case 3:
        this.setState({
          underlineLeft: '82.5%',
          tabIndex: 3
        })
        break
      default:
        this.setState({
          tabIndex: 0
        })
        break
    }
  }

  handleChange = (item, index) => {
    const { dispatch } = this.props
    switch (index) {
      case 0:
        this.setState({
          underlineLeft: '7.5%'
        })
        dispatch({
          type: 'orderList/setOrderStatus',
          payload: {
            orderStatus: 0
          }
        })
        break
      case 1:
        this.setState({
          underlineLeft: '32.5%'
        })
        dispatch({
          type: 'orderList/setOrderStatus',
          payload: {
            orderStatus: 1
          }
        })
        break
      case 2:
        this.setState({
          underlineLeft: '57.5%'
        })
        dispatch({
          type: 'orderList/setOrderStatus',
          payload: {
            orderStatus: 2
          }
        })
        break
      case 3:
        this.setState({
          underlineLeft: '82.5%'
        })
        dispatch({
          type: 'orderList/setOrderStatus',
          payload: {
            orderStatus: 3
          }
        })
        break
      default:
        this.setState({
          underlineLeft: '7.5%'
        })
        dispatch({
          type: 'orderList/setOrderStatus',
          payload: {
            orderStatus: 0
          }
        })
        break
    }
  }

  render() {
    const { tabs, tabIndex, underlineLeft } = this.state
    const { userName } = this.props
    const { wantCustomer } = this.context
    if (wantCustomer) {
      JumpUserCustomer({ robotFlag: 1 }, userName)
    }
    return (
      <div className={style.orderList}>
        {tabIndex !== undefined ? (
          <Tabs
            tabs={tabs}
            tabBarPosition="top"
            initialPage={tabIndex}
            tabBarUnderlineStyle={{
              width: '10%',
              left: underlineLeft
            }}
            onChange={this.handleChange}
          />
        ) : null}

        <AllOrder />
        <OpenApp params={{ type: 10 }} />
      </div>
    )
  }
}

const mapState = state => ({
  userName: state.all.userName,
  orderStatus: state.orderList.orderStatus
})

export default connect(mapState)(OrderList)
