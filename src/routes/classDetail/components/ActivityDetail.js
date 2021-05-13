import React, { Component } from 'react'
import { connect } from 'dva'
import { unDisableScroll } from '@/utils/global'
import detail from '../classDetail.less'

class ActivityDetail extends Component {
  hideDetail() {
    unDisableScroll()
    const { dispatch } = this.props
    dispatch({ type: 'classDetail/setHide' })
  }

  render() {
    const { isShow, activityList } = this.props
    return (
      <div className={`${detail.ActivityDetail} ${isShow ? 'db' : 'dn'}`}>
        <div className={detail.shade} onClick={this.hideDetail.bind(this)} />
        <div className={detail.ActivityDetailWrapper}>
          <h3>
            活动
            <i
              onClick={this.hideDetail.bind(this)}
              className="iconfont iconCombinedShapex-"
            />
          </h3>
          <ul className={detail.actList}>
            {Object.prototype.toString.call(activityList) !== '[object Array]'
              ? activityList.data &&
                activityList.data.map(item => (
                  <li className={detail.actItem} key={item.type}>
                    <span className={detail.tag}>{item.title}</span>
                    <p
                      className={detail.desc}
                      dangerouslySetInnerHTML={{ __html: item.introduction }}
                    />
                  </li>
                ))
              : null}
          </ul>
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  isShow: state.classDetail.isShow,
  activityList: state.classDetail.activityList
})

export default connect(mapState)(ActivityDetail)
