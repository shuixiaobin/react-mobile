import React from 'react'
import { connect } from 'dva'
import { routerRedux, withRouter } from 'dva/router'
import header from '../header.less'
import Nav from '../nav/root'
import { getCookie, setCookie } from '@/utils/global'

class OtherHeader extends React.Component {
  pull = () => {
    this.nav.toggle()
  }

  goBack() {
    const {
      dispatch,
      location: { pathname, search },
      history: { length }
    } = this.props

    // search.hasOwnProperty('orderAddressId')
    if (
      pathname === '/other/addressList' &&
      search.hasOwnProperty('orderAddressId')
    ) {
      dispatch(routerRedux.replace({ pathname: '/class/buy', search })) // 支付结果跳转我的订单
    } else if (length > 1) {
      if (pathname === '/other/password' || pathname === '/other/agreement') {
        dispatch({ type: 'all/showLogin' })
        sessionStorage.setItem('showLogin', true)
      }
      dispatch(routerRedux.goBack())
      // if(this.props.history.action == "REPLACE"){
      //   dispatch(routerRedux.goBack())
      // }
    } else {
      dispatch(routerRedux.push({ pathname: '/home' }))
    }

    this.clearOtherState()
  }

  /**
   * 清空 model state
   */
  clearOtherState() {
    const { dispatch, titleName = '' } = this.props
    const needClearMaps = {
      热门资讯: 'information/CLEAR_INFOR_STATE'
    }
    const needClearModel = needClearMaps[titleName] || ''

    // eslint-disable-next-line no-unused-expressions
    needClearModel && dispatch({ type: needClearModel })
  }

  render() {
    const { location, titleName } = this.props
    const search = qs.parse(location.search)
    console.log(decodeURI(search.title))
    const isInApp = getCookie("isAppUser")
    return (
      <div
        id={header.global_header}
        data-header="global_header"
        className={`${header.class_detail}`}
      >
        {isInApp && location.pathname == '/other/collectList' ? (
          ""
        ) : (
          <span
            onClick={this.goBack.bind(this)}
            className={`${header.back} iconfont icondafanhuix f40`}
          />
        )}
        <h3 id="headerTit" className={`${header.title}`}>
          {(search.title && decodeURI(search.title)) || titleName}
        </h3>

    
        {
          isInApp ? "" : (
            <div onClick={this.pull} className={header.rightIcon}>
                <span className="iconfont iconshanxuanx- f40" />
            </div>
          )
        }
        
        {
          isInApp ? "" : (
            <Nav
              triggerRef={ref => {
                this.nav = ref
              }}
            />
          )
        }
      </div>
    )
  }
}

function mapState(state) {
  return {
    titleName: state.all.title
  }
}

export default withRouter(connect(mapState)(OtherHeader))
