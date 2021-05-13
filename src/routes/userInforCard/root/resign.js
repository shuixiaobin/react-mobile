import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux, withRouter } from 'dva/router'
import { Toast } from 'antd-mobile'
import card from '../userInforCard.less'
import * as order from '@/services/order'
import { getCookie } from '@/utils/global.js'

class UserInforCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contract_id: ''
    }
  }
  componentDidMount() {
    const { location } = this.props
    const search = qs.parse(location.search)
    this.setState({ ...search }, () => {
      this.getWillOrder()
    })
  }

  getWillOrder = async () => {
    try {
      const data = await order.getWillOrder({
        classId: this.state.classId,
        pageSource: encodeURIComponent(document.referrer)
      })
      this.setState({ list: data })
    } catch (error) {
      Toast.info(error)
    }
  }

  getSignResult = async () => {
    const { dispatch } = this.props
    try {
      const data = await order.getSignResult({ contract_id: this.state.contract_id })
      if (data.state == 1) {
        dispatch(routerRedux.goBack())
      }
    } catch (error) {
      Toast.info(error)
    }
  }

  getConcat = () => {
    const { list } = this.state
    PresaleClassCustomer({
      name: list.cateName,
      userInfo: getCookie('UserName') || '',
      title: list.title,
      href: window.location.href,
      classImg: list.scaleimg
    })
  }


  render() {
    return (
      <div id={card.userInfor}>
        <div className={card.resign}>
          <div className={card.resignIcon}><i className={`f42 iconfont iconwtg`}></i></div>
          <p className={card.resignTip}>签订信息异常，请点击下方按钮重新提交。如多次尝试仍无法成功，请联系客服。</p>
          <p className={`${card.resignBtn} ${card.btnSubmit}`} onClick={this.getSignResult}>重新提交</p>
          <p className={`${card.resignBtn} ${card.btnConcat}`} onClick={this.getConcat}>
            <i className={`iconfont iconkefuhongse f36`}></i>
            <span>联系客服</span>
          </p>
        </div>
      </div>
    )
  }
}

export default withRouter(connect()(UserInforCard))
