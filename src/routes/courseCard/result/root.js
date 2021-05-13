import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import * as order from '@/services/order'
import { ToApp } from '@/utils/setSensors'
import back from './back.less'

class BuyBack extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      result: '1'
    }
  }

  componentDidMount() {
    const { location } = this.props
    const search = qs.parse(location.search)
  }

  componentWillUnmount() {
    this.setState({
      result: ''
    })
  }


  goMyClass(){
    const { location, dispatch } = this.props
    if( (navigator.userAgent.indexOf("HuaTuOnline")  > -1  || navigator.userAgent.indexOf("HuaTuTeacher") > -1 )  && navigator.userAgent.indexOf("Android") > -1){
      window.location.href ="ztk://course/study/home"
    }else{
      dispatch(routerRedux.push({
        pathname: '/class/myClass'
      }))
    }
  }

  render() {
    const { result} = this.state
    const { location, dispatch } = this.props
    const search = qs.parse(location.search)
    return result === '' ? '' : (
      <div className={back.back}>
        <div>
          <svg
            width="60px"
            height="60px"
            viewBox="0 0 60 60"
            version="1.1"
          >
            <g
              id="支付页面备份-3"
              transform="translate(-158.000000, -93.000000)"
              fill="#68BF7B"
              fillRule="nonzero"
            >
              <g id="编组" transform="translate(158.000000, 93.000000)">
                <path
                  d="M30,0 C13.4571428,0 0,13.4571428 0,30 C0,46.5428572 13.4571428,60 30,60 C46.5428572,60 60,46.5428572 60,30 C60,13.4571428 46.5428572,0 30,0 Z M48,20.1428572 C48,20.1428572 32.3142857,37.4571429 28.8,41.5714286 C25.2857143,45.6857143 22.5428572,41.5714286 22.5428572,41.5714286 L12.3428572,31.0285714 C12.3428572,31.0285714 10.7142857,28.5428572 13.6285714,26.2285714 C16.3714286,24 18.6,26.2285714 18.6,26.2285714 L25.8,33.7714286 L43.7142857,17.0571428 C43.7142857,17.0571428 45.4285714,15.8571428 47.2285714,17.4 C48.6,18.6857143 48,20.1428572 48,20.1428572 L48,20.1428572 Z"
                  id="形状"
                />
              </g>
            </g>
          </svg>
          <p className="f36">兑换成功</p>
        </div>
        <div className={`${back.bottom} f32`}>
          <button className="f36" type="button" className={back.footer} onClick={() => { dispatch(routerRedux.goBack()) }}>
            知道了
          </button>

          <div className={back.blank} />

          <button className="f36" type="button" className={back.footer} onClick={() => this.goMyClass()}> 查看课程
          </button>
        </div>
      </div>
    )
  }
}

export default connect()(BuyBack)
