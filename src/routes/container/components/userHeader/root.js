import React from 'react'
import { connect } from 'dva'
import { routerRedux, withRouter } from 'dva/router'
import header from '../header.less'

class UserHeader extends React.Component {
  goBack() {
    const {
      dispatch,
      history: { length }
    } = this.props

    if (length > 1) {
      dispatch(routerRedux.goBack())
    } else {
      dispatch(routerRedux.push({ pathname: '/home' }))
    }
  }

  goLink() {
    const { dispatch, userName } = this.props

    if (userName) {
      JumpUserCustomer({ robotFlag: 1 }, userName)
    } else {
      dispatch({
        type: 'all/showLogin'
      })
    }
  }

  render() {
    const { titleName, location } = this.props

    return (
      <div
        id={header.global_header}
        data-header="global_header"
        className={header.class_detail}
      >
        <span
          onClick={this.goBack.bind(this)}
          className={`${header.back} iconfont icondafanhuix f40`}
        />
        <h3 id="headerTit" className={`${header.title}`}>
          {titleName}
        </h3>
        {
          location.pathname == '/user/resign' || location.pathname == '/user/signresult' ? '' :(
            <div className={header.rightIcon} onClick={this.goLink.bind(this)}>
              <span className={`${header.referIcon}`}/>
              {/* <span className={`${header.referIcon} iconfont iconkefuhongse f40`} /> */}
            </div>
          )
        }
      </div>
    )
  }
}

function mapState(state) {
  return {
    titleName: state.all.title,
    userName: state.all.userName
  }
}

export default withRouter(connect(mapState)(UserHeader))
