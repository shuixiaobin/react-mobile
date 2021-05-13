import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import user from './user.less'
import OpenApp from '@/components/openApp/root'
import CopyRight from '@/components/copyRight/root'
import { CilckButton } from '@/utils/setSensors'

class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabMaps: [
        {
          name: '我的课程',
          path: '/class/myClass',
          icon: 'iconfont icongerenzhongxin-kechengx'
        },
        {
          name: '我的订单',
          path: '/class/orderList',
          icon: 'iconfont iconbianzubeifenx1'
        },
        {
          name: '收货地址',
          path: '/other/addressList',
          icon: 'iconfont icongerenzhongxin-dizhix'
        },
        {
          name: '在线客服',
          path: '/',
          icon: 'iconfont iconkefuheise',
          onClick: () => {
            JumpUserCustomer({ robotFlag: 1 }, this.props.userName)
          }
        },
        {
          name: '账号信息',
          path: '/other/myInfo',
          icon: 'iconfont icongerenzhongxin-zhanghaox'
        }
      ]
    }
  }

  goLink(url, name, callback) {
    const { dispatch, userName } = this.props
    CilckButton({
      on_page: '个人中心',
      first_module: '页面按钮',
      button_name: name
    })
    if (userName) {
      if (callback) return callback()
      dispatch(routerRedux.push({ pathname: url }))
    } else {
      dispatch({
        type: 'all/showLogin'
      })
    }
  }

  render() {
    const { tabMaps } = this.state
    return (
      <div id={user.userCenter}>
        <ul>
          {tabMaps.map(item => (
            <li
              key={item.path}
              onClick={() => this.goLink(item.path, item.name, item.onClick)}
            >
              <div className="oh">
                <p className={`${user.left} fl f32`}>
                  <i className={`${item.icon} f40`} />
                  <span>{item.name}</span>
                </p>
                <p className={`${user.right} fr`}>
                  {item.name === '账号信息' ? (
                    <span className={`${user.phone} f26`}>
                      {getCookie('UserMobile')}
                    </span>
                  ) : null}
                  <span className="iconfont iconbianzux3 f36" />
                </p>
              </div>
            </li>
          ))}
        </ul>
        <CopyRight />
        <OpenApp params={{ type: 9 }} />
      </div>
    )
  }
}

const mapState = state => ({
  myUrl: state.all.myUrl,
  userName: state.all.userName
})

export default connect(mapState)(User)
