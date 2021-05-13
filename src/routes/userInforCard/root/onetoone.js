import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux, withRouter } from 'dva/router'
import { Toast } from 'antd-mobile'
import OneToOne from '../components/oneToOne/root'
import OneToOneStudent from '../components/oneToOneStudent/root'
import card from '../userInforCard.less'
import { PostUserInforoto } from '@/services/javaApi'

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
  state = { param: {}, searchParam: {} }

  componentDidMount() {
    const { location } = this.props

    // eslint-disable-next-line react/no-unused-state
    this.setState({ searchParam: { ...qs.parse(location.search) } })
  }

  validateFields = async () => {
    const {
      searchParam: { type, OrderNum, rid, NetClassCategoryId }
    } = this.state
    let copyErrors = {}

    try {
      const fieldName = parseInt(type) === 1 ? 'OneToOne' : 'OneToOneStudent'

      const otherFields = this[fieldName].otherFields()
      const asyncFields = await Promise.all(this[fieldName].validateFields())
      const Fields = asyncFields.reduce((last, item = {}) => ({
        ...last,
        ...item
      }))
      const { param } = this.state

      this.setState(
        {
          param: {
            username: getCookie('UserName'),
            OrderNum,
            rid,
            NetClassCategoryId, // PHP用这个字段区分，教师或非教师
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
          this.PostUserInforoto()
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
  PostUserInforoto = async () => {
    console.log('data:', { ...this.state.param })
    try {
      const {
        dispatch,
        history: { length }
      } = this.props

      await PostUserInforoto({ ...this.state.param })
      Toast.info('学习信息已提交')

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
    const {
      searchParam: { type, oneToOne }
    } = this.state
    return (
      <div id={card.userInfor}>
        {parseInt(type) === 1 ? (
          // 教师
          <OneToOne
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            triggerRef={ref => {
              this.OneToOne = ref
            }}
          />
        ) : (
          // 非教师
          <OneToOneStudent
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            triggerRef={ref => {
              this.OneToOneStudent = ref
            }}
          />
        )}
        {oneToOne == 2 ? null : (
          // eslint-disable-next-line react/button-has-type
          <button
            className={`${card.submitBtn} f36`}
            onClick={this.validateFields}
          >
            完成并提交
          </button>
        )}
      </div>
    )
  }
}

export default withRouter(connect()(UserInforCard))
