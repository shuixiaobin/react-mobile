import React from 'react'
import { connect } from 'dva'
import { routerRedux, withRouter } from 'dva/router'
import { CilckButton } from '@/utils/setSensors'
import nav from './nav.less'

class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [
        {
          icon: 'iconfont iconshouyex',
          name: '首页课程',
          path: '/home'
        },
        {
          icon: 'iconfont iconremenzixunx',
          name: '热门资讯',
          path: '/other/informationList'
        },
        {
          icon: 'iconfont iconbeikaox',
          name: '备考精华',
          path: '/other/noteEssence'
        },
        {
          icon: 'iconfont icongerenzhongxin-zhanghaox',
          name: '个人中心',
          path: '/other/userCenter'
        }
      ]
    }
  }

  componentDidMount() {
    this.props.triggerRef(this)
  }

  // 开启
  toggle = () => {
    this.setGlobalFilterBlur(true)
  }

  // 关闭
  close = e => {
    const { nodeName } = e.target

    if (nodeName === 'DIV') {
      this.setGlobalFilterBlur(false)
    }
  }

  // 跳转关闭
  go = (path, name) => {
    console.log(path)
    console.log(name)

    CilckButton({
      on_page: '导航栏',
      first_module: '右上角',
      button_name: name
    })
    const {
      dispatch,
      location: { pathname }
    } = this.props

    this.setGlobalFilterBlur(false)

    if (path === pathname) return // 当前页不做处理
    if (path) {
      dispatch({
        // 清空热门资讯 model state
        type: 'information/CLEAR_INFOR_STATE'
      })

      dispatch(
        routerRedux.push({
          pathname: path
        })
      )
    }
  }

  // headerMenuShow：true
  // global_main-wrap 添加毛玻璃
  // body 禁止滚动
  setGlobalFilterBlur = async headerMenuShow => {
    const { dispatch } = this.props
    const globalMainWrap = document.getElementById('global_main-wrap')

    await dispatch({
      type: 'all/setHeaderMenuShow',
      payload: {
        show: headerMenuShow
      }
    })

    if (headerMenuShow) {
      disableScroll()
      globalMainWrap.style = 'filter: blur(3px);margin-top:10px;'
    } else {
      unDisableScroll()
      globalMainWrap.style = ''
    }
  }

  render() {
    const { show } = this.props
    const { data } = this.state

    return (
      <div
        id={nav.navPage}
        className={`${show ? 'db' : 'dn'} oh f36`}
        style={{ height: document.documentElement.clientHeight }}
        onClick={this.close}
      >
        <div style={{ height: document.documentElement.clientHeight }} />
        <ul id="select-nav">
          {data.map(item => (
            <li key={item.path} onClick={() => this.go(item.path, item.name)}>
              <i className={`${item.icon} f44`} />
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

const mapState = state => ({
  myUrl: state.all.myUrl,
  show: state.all.headerMenuShow
})

export default withRouter(connect(mapState)(Nav))
