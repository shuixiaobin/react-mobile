import React, { Component } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { InputItem, Toast } from 'antd-mobile'
import { registerFn, sendCode } from '@/services/javaApi'
import { CilckButton } from '@/utils/setSensors'
import { setCookie, parseUniondata } from '@/utils/global'
import login from '../loginIn.less'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phoneVal: '',
      codeVal: '',
      passwordVal: '',
      phoneError: false,
      codeError: false,
      passwordError: false,
      isTimeDown: false,
      timerObj: null,
      timerDown: 60
    }
  }

  componentWillReceiveProps(nextProps) {
    const { tabStr } = this.props
    const { timerObj } = this.state
    if (tabStr !== nextProps.tabStr) {
      if (timerObj) {
        clearInterval(timerObj)
      }
      this.inputRef.state.value = ''
      this.codeRef.state.value = ''
      this.passwordRef.state.value = ''
      this.setState({
        phoneVal: '',
        codeVal: '',
        passwordVal: '',
        phoneError: false,
        codeError: false,
        passwordError: false,
        isTimeDown: false,
        timerObj: null,
        timerDown: 60
      })
    }
  }

  componentWillUnmount() {
    const { timerObj } = this.state
    if (timerObj) {
      clearInterval(timerObj)
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
      default:
        break
    }
  }

  // ???????????????
  sendYzCode = () => {
    const { isTimeDown, phoneError, phoneVal } = this.state
    CilckButton({
      on_page: '?????????',
      first_module: '????????????',
      button_name: '???????????????'
    })
    if (isTimeDown || phoneError || !phoneVal) return
    sendCode(phoneVal)
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

  goAgreement = () => {
    const { dispatch } = this.props
    dispatch({ type: 'all/closeLogin' })
    dispatch(
      routerRedux.push({
        pathname: '/other/agreement'
      })
    )
  }

  register = () => {
    const unionData = parseUniondata(getCookie('uniondata') || '')
    const {
      phoneVal,
      codeVal,
      passwordVal,
      phoneError,
      codeError,
      passwordError
    } = this.state
    if (
      phoneError ||
      codeError ||
      passwordError ||
      !phoneVal ||
      !codeVal ||
      !passwordVal
    )
      return
    registerFn({
      mobile: phoneVal,
      captcha: codeVal,
      password: passwordVal,
      fromUser: unionData.fromuser || '',
      fromUserAdId: unionData.useradid || ''
    })
      .then(res => {
        const { dispatch } = this.props
        setCookie('ht_token', res.token)
        setCookie('UserName', res.uname)
        setCookie('UserFace', encodeURI(res.avatar)) // ??????????????????
        setCookie('UserReName', res.nick)
        setCookie('catgory', res.catgory)
        setCookie('UserId', res.id)
        setCookie('ucId', res.ucId)
        setCookie('UserMobile', res.mobile)
        dispatch({ type: 'all/checkIsLogin' })
        dispatch({ type: 'all/closeLogin' })
        if (typeof sensors !== 'undefined') {
          sensors.login(res.ucId)
        }
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
      isTimeDown,
      timerDown
    } = this.state
    return (
      <div className={login.register}>
        <div className={login.body}>
          <InputItem
            type="text"
            placeholder="??????????????????"
            className={login.phone}
            onBlur={v => {
              this.checkPhone(v)
            }}
            onFocus={() => this.clearError('phone')}
            onChange={val => {
              this.setState({ phoneVal: val })
            }}
            ref={el => (this.inputRef = el)}
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
              ref={el => (this.codeRef = el)}
              maxLength="6"
              placeholder="??????6????????????"
            >
              <i className={`iconfont iconyanzhengma f36 ${login.icon}`} />
            </InputItem>
            {codeError ? (
              <p className={login.errorPhone}>?????????????????????????????????</p>
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
            placeholder="???????????????"
            className={login.phone}
            onChange={val => {
              this.setState({ passwordVal: val })
            }}
            ref={el => (this.passwordRef = el)}
            clear
          >
            <i className={`iconfont iconmima f36 ${login.icon}`} />
          </InputItem>
          {passwordError ? (
            <p className={login.errorPhone}>?????????6-20??????????????????????????????</p>
          ) : null}
        </div>
        <p className={`${login.desc} f24`}>
          ???????????????????????????????????????
          <span onClick={this.goAgreement}>????????????????????????????????????</span>
        </p>
        <button
          type="button"
          onClick={this.register}
          className={`${login.loginBtn} f36`}
        >
          ????????????
        </button>
      </div>
    )
  }
}

const mapState = state => ({})
export default connect(mapState)(Register)
