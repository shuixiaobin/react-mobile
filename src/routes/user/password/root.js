import React, { Component } from 'react'
import { connect } from 'dva'
import { InputItem, Toast } from 'antd-mobile'
import { forgetSendCode, forgetPassword } from '@/services/javaApi'
import { routerRedux } from 'dva/router'
import login from './password.less'

class Password extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phoneVal: '',
      codeVal: '',
      passwordVal: '',
      passwordVal2: '',
      phoneError: false,
      codeError: false,
      passwordError: false,
      passwordError2: false,
      isTimeDown: false,
      timerObj: null,
      timerDown: 60
    }
  }

  checkPhone = () => {
    const { phoneVal, timerObj } = this.state
    const TEL_REGEXP = /^[1]([3-9])[0-9]{9}$/
    if (!TEL_REGEXP.test(phoneVal) && phoneVal.length > 0) {
      this.setState({
        phoneError: true
      })
    }
    if (timerObj) {
      clearTimeout(timerObj)
    }
  }

  checkCode = data => {
    const TEL_REGEXP = /^\d{6}$/
    if (!TEL_REGEXP.test(data) && data.length > 0) {
      this.setState({
        codeError: true
      })
      return
    }
    this.setState({ codeVal: data })
  }

  checkPassword = () => {
    const { passwordVal } = this.state
    const PASSWORD_REGEXP = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
    if (!PASSWORD_REGEXP.test(passwordVal) && passwordVal.length > 0) {
      this.setState({
        passwordError: true
      })
    }
  }

  checkPassword2 = () => {
    const { passwordVal, passwordVal2 } = this.state
    if (
      passwordVal.length > 0 &&
      passwordVal2.length > 0 &&
      passwordVal !== passwordVal2
    ) {
      this.setState({
        passwordError2: true
      })
    }
  }

  clearError = str => {
    switch (str) {
      case 'phone':
        this.setState({
          phoneError: false
        })
        break
      case 'code':
        this.setState({
          codeError: false
        })
        break
      case 'password':
        this.setState({
          passwordError: false
        })
        break
      case 'password2':
        this.setState({
          passwordError2: false
        })
        break
      default:
        break
    }
  }

  // ???????????????
  sendYzCode = () => {
    const { isTimeDown, phoneError, phoneVal } = this.state

    if (isTimeDown || phoneError || !phoneVal) return
    forgetSendCode(phoneVal)
      .then(() => {
        Toast.info('???????????????????????????????????????')
        this.setState({ isTimeDown: true, timerObj: this.setTimerDown() })
      })
      .catch(err => {
        Toast.info(err)
      })
  }

  setTimerDown = () => {
    const { timerObj } = this.state
    let total = 60
    return setInterval(() => {
      this.setState({
        timerDown: --total
      })
      if (total <= 0) {
        this.setState({
          isTimeDown: false,
          timerDown: 60
        })
        clearInterval(timerObj)
      }
    }, 1000)
  }

  // ??????
  submitFn = () => {
    const {
      phoneVal,
      codeVal,
      passwordVal,
      passwordVal2,
      phoneError,
      codeError,
      passwordError,
      passwordError2
    } = this.state
    if (
      !phoneVal ||
      !codeVal ||
      !passwordVal ||
      !passwordVal2 ||
      phoneError ||
      codeError ||
      passwordError ||
      passwordError2
    )
      return

    forgetPassword({
      mobile: phoneVal,
      password: passwordVal,
      captcha: codeVal
    })
      .then(() => {
        const { dispatch } = this.props
        Toast.success('??????????????????,???????????????', 2, () => {
          dispatch(routerRedux.goBack())
          sessionStorage.setItem('showLogin', true)
          dispatch({ type: 'all/showLogin' })
        })
      })
      .catch(err => {
        Toast.fail(err)
      })
  }

  render() {
    const {
      phoneError,
      codeError,
      passwordError,
      passwordError2,
      isTimeDown,
      timerDown
    } = this.state
    return (
      <div
        className={login.password}
        style={{ height: document.documentElement.clientHeight - 45 }}
      >
        <div className={login.body}>
          <InputItem
            type="text"
            placeholder="??????????????????"
            onFocus={() => this.clearError('phone')}
            className={login.phone}
            onChange={val => {
              this.setState({ phoneVal: val })
            }}
            onBlur={() => {
              this.checkPhone()
            }}
            clear
          >
            <i className={`iconfont iconshouji f36 ${login.icon}`} />
          </InputItem>
          {phoneError ? (
            <p className={login.errorPhone}>???????????????????????????</p>
          ) : null}
        </div>
        <div className={login.body}>
          <div className={login.inputCode}>
            <InputItem
              type="number"
              onFocus={() => this.clearError('code')}
              onBlur={v => {
                this.checkCode(v)
              }}
              maxLength="6"
              placeholder="??????6????????????"
            >
              <i className={`iconfont iconyanzhengma f36 ${login.icon}`} />
            </InputItem>
            {codeError ? (
              <p className={login.errorCode}>?????????????????????????????????</p>
            ) : null}
          </div>
          {isTimeDown ? (
            <div className={login.sendAgain}>{timerDown}s????????????</div>
          ) : (
            <div onClick={this.sendYzCode} className={login.sendCode}>
              ???????????????
            </div>
          )}
        </div>
        <div className={login.body}>
          <InputItem
            type="password"
            onFocus={() => this.clearError('password')}
            onBlur={this.checkPassword}
            placeholder="????????????6???-20????????????"
            className={login.phone}
            onChange={val => {
              this.setState({ passwordVal: val })
            }}
            clear
          >
            <i className={`iconfont iconmima f36 ${login.icon}`} />
          </InputItem>
          {passwordError ? (
            <p className={login.errorPhone}>?????????6-20??????????????????????????????</p>
          ) : null}
        </div>
        <div className={login.body}>
          <InputItem
            type="password"
            onFocus={() => this.clearError('password2')}
            onBlur={this.checkPassword2}
            placeholder="????????????"
            className={login.phone}
            onChange={val => {
              this.setState({ passwordVal2: val })
            }}
            clear
          >
            <i className={`iconfont iconmima f36 ${login.icon}`} />
          </InputItem>
          {passwordError2 ? (
            <p className={login.errorPhone}>????????????????????????????????????</p>
          ) : null}
        </div>
        <button
          type="button"
          className={`${login.submitBtn} f36`}
          onClick={this.submitFn}
        >
          ??????
        </button>
      </div>
    )
  }
}

export default connect()(Password)
