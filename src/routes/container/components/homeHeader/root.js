import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import header from '../header.less'
import Nav from '../nav/root'
import { CilckButton } from '@/utils/setSensors'

class Homeheader extends React.Component {
  toSearch = () => {
    const { dispatch } = this.props

    dispatch(
      routerRedux.push({
        pathname: '/search'
      })
    )
  }

  toUser = () => {
    const { dispatch } = this.props

    dispatch(
      routerRedux.push({
        pathname: '/other/userCenter'
      })
    )
  }

  toLogin = () => {
    // 神策按钮埋点
    CilckButton({
      on_page: '首页',
      first_module: '页面右上角',
      button_name: '登录'
    })
    this.props.dispatch({ type: 'all/showLogin' })
    console.log('tologin')
  }

  pull = () => {
    this.nav.toggle()
  }

  render() {
    const { myUrl, userHead } = this.props
    return (
      <div data-id="home_header">
        <div className={header.zw} />
        <div
          id={header.global_header}
          data-header="global_header"
          className={header.home_header}
        >
          <div className={`${header.logo} fl`}>
            <img src={`${myUrl}logo.png`} alt="" />
          </div>
          <ul className={`${header.func} fr clearfix`}>
            <li
              onClick={this.toSearch}
              className="iconfont iconShapex- f40 fl"
            />
            <li className={`${header.login} fl`}>
              {userHead ? (
                <img
                  src={userHead}
                  alt=""
                  className="br50"
                  onClick={this.toUser}
                />
              ) : (
                <p onClick={this.toLogin} className="f30">
                  登录
                </p>
              )}
            </li>
            <li onClick={this.pull} className="iconfont iconshanxuanx- fl f40" />
          </ul>
          {/* 导航 */}
          <Nav
            triggerRef={ref => {
              this.nav = ref
            }}
          />
        </div>
      </div>
    )
  }
}

function mapState(state) {
  return {
    userHead: state.all.userHead
  }
}

export default connect(mapState)(Homeheader)
