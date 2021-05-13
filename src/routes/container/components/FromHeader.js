import React from 'react'
import { connect } from 'dva'
import { routerRedux, withRouter } from 'dva/router'
import header from './header.less'
import { getCookie,setCookie, parse_url } from '@/utils/global.js'


/* 增加url传token获取登录状态 */
class FromHeader extends React.Component {

  goBack() {
    const {
      dispatch,
      location: { pathname, search },
      history: { length }
    } = this.props

  }


  componentDidMount() {
    //this.props.triggerRef(this)
    setCookie("UserName", getQueryStr('userName'))
    this.props.dispatch({ type: 'all/checkIsLogin' }) 
  }

  

  render() {
    const { location, titleName } = this.props
    const search = qs.parse(location.search)

    return (
      <div
        id={header.global_header}
        data-header="global_header"
        className={`${header.class_detail}`}
      >
        <span
          onClick={this.goBack.bind(this)}
          className={`${header.back} iconfont icondafanhuix f40`}
        />
        <h3 id="headerTit" className={`${header.title}`}>
          课程详情
        </h3>
      </div>
    )
  }
}

function mapState(state) {
  return {
    titleName: state.all.title
  }
}

export default withRouter(connect(mapState)(FromHeader))
