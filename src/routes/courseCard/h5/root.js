import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import * as cardH5 from '@/services/courseCard'
import { Toast, List, Modal, InputItem } from 'antd-mobile'
import card from './h5.less'
import { getCookie } from '@/utils/global'
import Login from '@/components/loginIn'
import PropTypes from 'prop-types'

const { alert } = Modal;
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(
  window.navigator.userAgent
)
let moneyKeyboardWrapProps
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault()
  }
}


//教师端如果有h5场景，url也要带appType=3
class courseCardH5 extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      lessonId: '',
      ableSelected: false,
      codeWrong: false,
      modalAddress: false,
    }
  }

  

  componentDidMount() {
    const { location, dispatch } = this.props
    //const userName = isInApp() || getQueryStr("appType") ? getQueryStr("userName"): this.props.userName
    const userName = this.props.userName ? this.props.userName : getQueryStr("userName")
    if (!userName || userName == null) {
      dispatch({
        type: 'all/showLogin'
      })
    }
  }

  componentWillReceiveProps(nextProps){
    const { location, dispatch } = this.props
    const { lessonId, ableSelected } = this.state
    if(!isInApp() && nextProps.userName && lessonId){
      this.setState({
        ableSelected: true,
        codeWrong: false
      })
    }
  } 



  checkCode = e => {
    const { location, dispatch } = this.props
    const userName = this.props.userName ? this.props.userName : getQueryStr("userName")
    const TEL_REGEXP = /^[a-zA-Z\d]{1,15}$/
    if(!e){
      return
    }else if (!e || !TEL_REGEXP.test(e)) {
      this.setState({
        ableSelected: false,
        codeWrong: true
      })
    }else if (!userName || userName == null) {
      dispatch({type: 'all/showLogin'});
      this.setState({
        codeWrong: false
      })
    }else {
      this.setState({
        ableSelected: true,
        codeWrong: false
      })
    }
  }


  goActive() {
    //激活无实物课程卡
    const { lessonId, ableSelected } = this.state
    const { dispatch, location } = this.props
    const userName = this.props.userName ? this.props.userName : getQueryStr("userName")
    if (!ableSelected) return;
    
    //检测是否有实物,有实物的话跳到地址选择页
    cardH5.activeCard({
      cardPass: lessonId,
      userName
    }).then(res => {
      //Toast.success('激活成功！')
      if (res.needAddress) {
        this.setState({ modalAddress: true })
      } else {
        dispatch(routerRedux.push({
          pathname: '/courseCardResult',
          search: qs.stringify({
            userName
          })
        }))
      }
    }).catch(error => {
      //console.log(error)
    })
  }

  cancelModalAddress() {
    console.log(1111)
    this.setState({ modalAddress: false })
    Toast.info('激活取消！')
  }

  render() {
    const { lessonId, ableSelected, codeWrong, modalAddress } = this.state
    const { location, dispatch} = this.props
    const search = qs.parse(location.search)
    const userName = this.props.userName ? this.props.userName : getQueryStr("userName")
    const _this = this;

    return (
      <>
      <div className={card.top}>
        <div className={card.headerInput}>
          <InputItem
            placeholder="请输入激活码"
            clear
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            value={lessonId}
            onBlur={e => { this.checkCode(e) }}
            onChange={e => { this.setState({ lessonId: e }) }}
          />
        </div>


        <div className={card.content}>
          {codeWrong ? <p className={card.codeWrong}>激活码错误，请重新输入</p> : ''}
          <div className={card.contentHeader}>
            <p>温馨提示</p>
          </div>
          <div className={card.contentBody}>
            <p>·【学习课程】</p>
            <p>移动端：兑换成功的课程可在APP'学习'中查看并学习；</p>
            <p>电脑端：在华图在线官网(v.huatu.com)中查看并学习；</p>
            <p>·【查看订单】</p>
            <p>移动端：可在APP'我的'-'我的订单'中查看；</p>
            <p>电脑端：在华图在线官网'个人中心'-'个人帐户'-'我的订单'中查看；</p>
            <p>·【物流信息】</p>
            <p>含实物课程的物流信息请在APP'我的'-'我的订单'中查看；</p>
            <p>·【联系我们】</p>
            <p className={card.lastP}>如有疑问，请联系<a onClick={() => {
                JumpUserCustomer({ robotFlag: 1 }, userName)
            }} className={card.kefu}>华图在线客服</a></p>
          </div>
        </div>
        <div className={card.last}>
          <div className={ableSelected ? `${card.foot}` : `${card.foot} ${card.noCilick}`} onClick={this.goActive.bind(_this)}>
            <div className={card.add}>激活</div>
          </div>
        </div>
      </div>
      <Login />

      <Modal
        visible={modalAddress}
        transparent
        maskClosable={false}
        title="提示"
        footer={[
          { text: '取消', onPress: () => { this.setState({ modalAddress: false }) } },
          {
            text: '确定', onPress: () => {   
              dispatch(routerRedux.push({
                pathname: '/addressInfo', search: qs.stringify({
                  lessonId,
                  userName
                })
              }))
            }
          }
        ]}
        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
      >
        <div>
          <p>您兑换的课程含图书，请选一个收货地址吧!</p>
        </div>
      </Modal>
      </>
    )
  }
}

function mapState(state) {
  return {
    userName: state.all.userName
  }
}

export default connect(mapState)(courseCardH5)
