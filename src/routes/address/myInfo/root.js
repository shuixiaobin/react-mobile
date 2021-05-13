import React from 'react'
import { connect } from 'dva'
import { List, Modal } from 'antd-mobile'
import my from './myInfo.less'
import { getCookie, setCookie } from '@/utils/global'
import { clearUps } from '@/utils/upData.js'


const { Item } = List
function closest(el, selector) {
  const matchesSelector =
    el.matches ||
    el.webkitMatchesSelector ||
    el.mozMatchesSelector ||
    el.msMatchesSelector
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el
    }
    el = el.parentElement
  }
  return null
}
class MyInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalShow: false
    }
  }

  onWrapTouchStart = e => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return
    }
    const pNode = closest(e.target, '.am-modal-content')
    if (!pNode) {
      e.preventDefault()
    }
  }

  quit = () => {
    const { dispatch } = this.props
    this.setState({ modalShow: false })
    setCookie('ht_token', '')
    setCookie('UserName', '')
    setCookie('UserFace', '')
    setCookie('UserReName', '')
    setCookie('firstLogin', '')
    setCookie('catgory', '')
    setCookie('UserId', '')
    setCookie('UserMobile', '')
    setCookie('ucId', '')

    setCookie("htzxUps",'')
    localStorage.setItem('visitorId',  '');
    window.location.href = ENVURL
  }

  render() {
    return (
      <div>
        <List className={my.info}>
          <Item className={my.myitem}>
            <p>
              <span className={my.lable}>手机号</span>
              <span className={my.content}>{getCookie('UserMobile')}</span>
            </p>
          </Item>
          <Item className={my.myitem}>
            <p>
              <span className={my.lable}>账号信息</span>
              <span className={my.content}>{getCookie('UserName')}</span>
            </p>
          </Item>
          {/* <Item className={my.myitem}>
            <p>
              <span className={my.lable}>会员登记</span>
              <span className={my.content}>LV{getCookie('catgory')}</span>
            </p>
          </Item> */}
          <div className={my.borderLine} />
          <Item
            className={my.exit}
            onClick={() => {
              this.setState({ modalShow: true })
            }}
          >
            <p>退出登录</p>
          </Item>
        </List>

        <Modal
          visible={this.state.modalShow}
          transparent
          maskClosable={false}
          className={my.modal}
          title="提示"
          footer={[
            {
              text: '取消',
              onPress: () => {
                this.setState({ modalShow: false })
              }
            },
            {
              text: '确定',
              onPress: () => {
                this.quit()
              }
            }
          ]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <div>
            <p>退出当前账号？</p>
          </div>
        </Modal>
      </div>
    )
  }
}

function mapState(state) {
  return {
    token: state.all
  }
}

export default connect(mapState)(MyInfo)
