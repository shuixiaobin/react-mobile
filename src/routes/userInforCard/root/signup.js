import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux, withRouter } from 'dva/router'
import { Toast } from 'antd-mobile'
import SignUp from '../components/signUp/root'
import card from '../userInforCard.less'
import { PostUserInforSignup, GetProtocolInfo } from '@/services/cardService'
import * as order from '@/services/order'

// 通过自定义 moneyKeyboardWrapProps 修复虚拟键盘滚动穿透问题
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(
  window.navigator.userAgent
)
let moneyKeyboardWrapProps
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault()
  }
}

class UserInforCard extends Component {
  state = {
    param: {},
    protocolUrl: '',
    protocolId: '',
    rid: '',
    protocolName: ''
  }

  componentDidMount() {
    const { location } = this.props
    const search = qs.parse(location.search)

    this.setState({ ...search }, () => {
      this.GetProtocolInfo()
    })
  }

  GetProtocolInfo = async () => {
    const { protocolId } = this.state

    try {
      const { url } = await GetProtocolInfo({
        userName: getCookie('UserName') || 'app_ztk817878886',
        protocolId
      })

      this.setState({ protocolUrl: url })
    } catch (e) {
      Toast.fail(e)
    }
  }

  validateFields = async () => {
    let copyErrors = {}
    try {
      const otherFields = this.SignUp.otherFields()
      const asyncFields = await Promise.all(this.SignUp.validateFields())
      const Fields = asyncFields.reduce((last, item = {}) => ({
        ...last,
        ...item
      }))
      const { param, protocolId } = this.state

      this.setState(
        {
          param: {
            userName: getCookie('UserName'),
            protocolId,
            ...param,
            ...otherFields,
            ...Object.keys(Fields).reduce(
              (last, item) => ({
                ...last,
                [item]: Fields[item] && formatDate(Fields[item]).toString()
              }),
              {}
            )
          }
        },
        () => {
          this.PostUserInforSignup()
        }
      )
    } catch ({ errors, values }) {
      if (JSON.stringify(copyErrors) === '{}') {
        copyErrors = Object.values(errors)
      }
      console.log('copyErrors:', copyErrors)
      Toast.info(copyErrors[0].errors[0].message)
    }
  }

  // 提交
  PostUserInforSignup = async () => {
    console.log('data:', { ...this.state.param })
    try {
      const {
        dispatch,
        history: { length }
      } = this.props
      const { rid, param ,orderNum} = this.state

      await PostUserInforSignup(rid ? { ...param, rid ,orderNum} : { ...param ,orderNum})
      Toast.info('报名信息已提交')

      if (length > 1) {
        dispatch(routerRedux.goBack())
      } else {
        dispatch(routerRedux.push({ pathname: '/home' }))
      }
    } catch (e) {
      Toast.fail(e)
    }
  }

  render() {
    const { protocolName } = this.state

    return (
      <div id={card.userInfor}>
        <SignUp
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          triggerRef={ref => {
            this.SignUp = ref
          }}
        />
        <p className={`${card.xy} f24`}>
          <i className="iconfont iconxingzhuangx f32" />
          已同意签订{' '}
          <span
            onClick={() => {
              // eslint-disable-next-line react/destructuring-assignment
              window.location.href = this.state.protocolUrl
            }}
          >
            {/* {decodeURI(protocolName)} */}
            <span className={`f32`}>&laquo;</span>
            {protocolName}
            <span className={`f32`}>&raquo;</span>
          </span>
        </p>
        {
          // eslint-disable-next-line react/button-has-type
          <button
            className={`${card.submitBtn} f36`}
            onClick={this.validateFields}
          >
          签订协议
          </button>
        }
      </div>
    )
  }
}

export default withRouter(connect()(UserInforCard))
