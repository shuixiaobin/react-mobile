import { connect } from 'dva'
import React, { Component } from 'react'
import openApp from './openApp.less'
import { ToApp } from '@/utils/setSensors'

class OpenApp extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  goApp = () => {
    const { params } = this.props
    ToApp({
      on_page: '底部浮窗'
    })
    if (params) {
      switch (params.type) {
        case 5:
          window.location.href = `//ns.huatu.com/h5/index.html?type=${params.type}&typeId=${params.typeId}&categoryId=${params.categoryId}&title=${params.title}`
          break
        case 6:
          window.location.href = `//ns.huatu.com/h5/index.html?type=${params.type}`
          break
        case 7:
          window.location.href = `//ns.huatu.com/h5/index.html?type=${params.type}&id=${params.id}`
          break
        case 8:
          window.location.href = `//ns.huatu.com/h5/index.html?type=${params.type}`
          break
        case 9:
          window.location.href = `//ns.huatu.com/h5/index.html?type=${params.type}`
          break
        case 10:
          window.location.href = `//ns.huatu.com/h5/index.html?type=${params.type}`
          break
        case 16:
          window.location.href = `//ns.huatu.com/h5/index.html?type=${params.type}&collectionTitle=${params.title}&colletionID=${params.colletionID}`
          break
        default:
          window.location.href = `//ns.huatu.com/h5/index.html`
          break
      }
    } else {
      window.location.href = '//ns.huatu.com/h5/index.html'
    }
  }

  render() {
    const { myUrl } = this.props

    return (
      <div id={openApp.openAppWrap} className="oh">
        <img
          className={`${openApp.logo} fl`}
          src={`${myUrl}ht-logo.png`}
          alt=""
        />
        <div className={`${openApp.content} fl`}>
          <strong className="f32">华图在线</strong>
          <p className="f20">海量题库免费刷！</p>
        </div>
        {
          // eslint-disable-next-line react/button-has-type
          <button className={`${openApp.open} f28 fr`} onClick={this.goApp}>
            <span>打开APP</span>
          </button>
        }
      </div>
    )
  }
}

const mapState = state => ({
  myUrl: state.all.myUrl
})

export default connect(mapState)(OpenApp)
