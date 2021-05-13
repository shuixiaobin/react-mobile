import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal } from 'antd-mobile'
import detail from '../classDetail.less'

class AuditionCell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flag: false
    }
  }

  auditionHandle(videoType, token, videoId, bjyRoomId, bjySessionId,domainName) {
    const { dispatch, location } = this.props
    const search = qs.parse(location.search)
    const { classId } = search
    if (videoType === 5) {
      Modal.alert('', '音频课程，请前往华图在线App收听！', [ 
        { text: '关闭', onPress: () => console.log('cancel') },
        {
          text: '去APP',
          onPress: () => {
            window.location.href = `//ns.huatu.com/h5/index.html?rid=${classId}&type=4`
          }
        }
      ])
    } else {
      dispatch({
        type: 'classDetail/setCurrentAudition',
        payload: {
          videoType,
          token,
          videoId,
          bjyRoomId,
          bjySessionId,
          domainName
        }
      })
    }
  }

  handleAlert(e, id, title, flag) {
    e.stopPropagation()
    if (flag) {
      ToApp({
        on_page: '点击课后作业',
        course_title: title
      })
    } else {
      ToApp({
        on_page: '点击学习报告',
        course_title: title
      })
    }

    Modal.alert('', '请前往华图在线App体验此功能', [
      { text: '关闭', onPress: () => console.log('cancel') },
      {
        text: '去APP',
        onPress: () => {
          window.location.href = `//ns.huatu.com/h5/index.html?rid=${id}&type=4`
        }
      }
    ])
  }

  toggle() {
    const { flag } = this.state
    this.setState({
      flag: !flag
    })
  }

  render() {
    const { flag } = this.state
    const { auditionList } = this.props
    return auditionList.length > 0 ? (
      <div className={detail.outline}>
        <ul className={`${detail.twoLevel}`}>
          <div className={detail.title} onClick={this.toggle.bind(this)}>
            <h4 className={`${detail.twoLevelTit} ellipsis`}>试听单元</h4>
            <i
              className={`iconfont  ${
                flag ? 'iconshanglabeifen' : 'iconxiala2'
              }`}
            />
          </div>
          <li className={`${detail.oneLevel} ${flag ? 'db' : 'dn'}`}>
            {auditionList.map(item => (
              <div
                key={item.id}
                className={`${detail.container} clearfix`}
                onClick={this.auditionHandle.bind(
                  this,
                  item.videoType,
                  item.token,
                  item.videoId,
                  item.bjyRoomId,
                  item.bjySessionId,
                  item.domainName
                )}
              >
                <span className={`${detail.num} fl`}>{item.serialNumber}</span>
                <div className={`${detail.titleWrapper} fl`}>
                  <div className={detail.topWrapper}>
                    <h5 className={`${detail.oneLevelTit} ellipsis mr20`}>
                      {item.title}
                    </h5>
                    <span
                      className={`${detail.audition} ${
                        item.isTrial ? 'db' : 'dn'
                      }`}
                    >
                      试听
                    </span>
                  </div>
                  <div className={detail.desc}>
                    <span className={detail.classDesc}>{item.videoLength}</span>
                    <span className={`${detail.teacher} ellipsis`}>
                      主讲老师：{item.teacher}
                    </span>
                  </div>
                </div>
                {item.afterCoreseNum !== 0 || item.studyReport ? (
                  <div className="clearfix mt50">
                    {item.afterCoreseNum > 0 ? (
                      <div
                        className={`${detail.resultItem} fl `}
                        onClick={e =>
                          this.handleAlert(e, item.classId, item.title, true)
                        }
                      >
                        <i className="iconfont iconzuoyex f24 mr10" />
                        课后作业
                        <span className={detail.redWord}>
                          练习题-{item.afterCoreseNum}道题
                        </span>
                      </div>
                    ) : null}
                    {item.studyReport ? (
                      <div
                        className={`${detail.resultItem} fl ml20`}
                        onClick={e =>
                          this.handleAlert(e, item.classId, item.title, false)
                        }
                      >
                        <i className="iconfont iconxuexibaogaoiconx f24 mr10" />
                        学习报告
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </li>
        </ul>
      </div>
    ) : null
  }
}
const mapState = state => ({
  auditionList: state.classDetail.auditionList
})

export default connect(mapState)(AuditionCell)
