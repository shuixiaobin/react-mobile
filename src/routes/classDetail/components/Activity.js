import React, { Component } from 'react'
import { connect } from 'dva'
import { disableScroll } from '@/utils/global'
import detail from '../classDetail.less'

class Activity extends Component {
  showDetail() {
    disableScroll()
    const { dispatch } = this.props
    dispatch({
      type: 'classDetail/setShow'
    })
  }

  render() {
    const { activityList, hasM } = this.props

    return activityList && activityList.data && activityList.data.length >0 ? (
      <div
        className={detail.activity}
        onClick={this.showDetail.bind(this)}
        style={hasM ? { margin: '5px 0' } : {}}
      >
        <div className="leftCon clearfix">
          <div className={`${detail.act_title} fl`}>活动：</div>
          <div className={`${detail.act_content} fl`}>
            {Object.prototype.toString.call(activityList) !== '[object Array]'
              ? activityList.data &&
                activityList.data.map(item => (
                  <span className={detail.activityItem} key={item.type}>
                    {item.title}
                  </span>
                ))
              : null}
          </div>
        </div>
        <i className="iconfont iconbianzux3 f24" />
      </div>
    ) : (
      ''
    )
  }
}

const mapState = state => ({
  activityList: state.classDetail.activityList
})

export default connect(mapState)(Activity)
