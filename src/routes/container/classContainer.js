import { connect } from 'dva'
import React from 'react'
import { Switch } from 'dva/router'
import PropTypes from 'prop-types'
import ClassHeader from './components/classHeader/root'
import Loading from '@/components/loading/root'
import Login from '@/components/loginIn'
import { getCookie } from '@/utils/global.js'

class ClassContainer extends React.Component {
  state = {
    wantCustomer: false
  }

  static childContextTypes = {
    wantCustomer: PropTypes.bool
  }

  getChildContext() {
    return {
      wantCustomer: this.state.wantCustomer
    }
  }

  render() {
    const { routerData,location } = this.props
    const { childRoutes } = routerData
    const isInApp = () => navigator.userAgent.indexOf("HuaTuOnline") > -1;
    return (
      <>
      {/* app嵌入协议退费页面时隐藏头部 */}
        {
          isInApp() && location.pathname == '/class/agreeRefund' ? null : (<ClassHeader
            JumpCustomerService={() => {
              this.setState({ wantCustomer: true })
            }}
            {...this.props}
          />)
        }
        <Loading>
          <Switch>{childRoutes}</Switch>
        </Loading>
        <Login />
      </>
    )
  }
}

function mapState(state) {
  return {
    myUrl: state.all.myUrl
  }
}

export default connect(mapState)(ClassContainer)
