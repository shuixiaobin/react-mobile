import React, { Component } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { NoticeBar } from 'antd-mobile'
import Filter from './components/Filter'
import style from './myClass.less'
import OpenApp from '@/components/openApp/root'
import { ToApp } from '@/utils/setSensors'

class MyClass extends Component {
  static contextTypes = {
    wantCustomer: PropTypes.bool
  }

  componentDidMount() {
    const { dispatch, userName } = this.props
    dispatch({
      type: 'myClass/getFilterType',
      payload: {
        userName
      }
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch({
      type: 'myClass/setReset'
    })
  }

  goApp() {
    ToApp({
      on_page: '我的课程页'
    })
    window.location.href = `//ns.huatu.com/h5/index.html&type=8`
  }

  render() {
    const { userName } = this.props
    const { wantCustomer } = this.context
    if (wantCustomer) {
      JumpUserCustomer({ robotFlag: 1 }, userName)
    }
    return (
      <div className={`${style.myClass} myClass`}>
        <NoticeBar marqueeProps={{ loop: true }} onClick={() => this.goApp()}>
          付费课程可享受更多服务，请前往华图在线APP/PC端听课
        </NoticeBar>
        <Filter />
        <OpenApp params={{ type: 8 }} />
      </div>
    )
  }
}

const mapState = state => ({
  userName: state.all.userName
})

export default connect(mapState)(MyClass)
