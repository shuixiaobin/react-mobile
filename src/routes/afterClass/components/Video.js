import React, { Component } from 'react'
import { connect } from 'dva'
import CountDown from '@/components/CountDown/root'
import afterStyle from '../afterClass.less'

class Video extends Component {
  componentWillReceiveProps(nextProps) {
    const { playData, dispatch, location, userName } = this.props
    const search = qs.parse(location.search)
    const { classId } = search
    if (JSON.stringify(playData) !== JSON.stringify(nextProps.playData)) {
      if (nextProps.playData.videoType === 2) {
        dispatch({
          type: 'afterClass/getLiveUrl',
          payload: {
            netClassId: classId,
            userName,
            ...nextProps.playData
          }
        })
      } else {
        dispatch({
          type: 'afterClass/setPlayUrl'
        })
      }
    }
  }

  render() {
    const { playUrl, playData } = this.props
    let playHtml
    if (playUrl !== '') {
      playHtml = (
        <iframe
          src={playUrl}
          title={playData.title}
          className={afterStyle.playWrapper}
          width="100%"
          height="100%"
          frameBorder="0"
        />
      )
    } else if (
      playUrl === '' &&
      playData.videoType === 2 &&
      playData.liveStart !== 0
    ) {
      playHtml = (
        <div className={afterStyle.defaultImg}>
          <span className={afterStyle.wait}>
            等待直播
            <i className="iconfont icondengdaizhibo" />
          </span>
          <p className={`${afterStyle.countDown} f36`}>
            倒计时：
            {playData.liveStart ? (
              <CountDown time={playData.liveStart * 1000} />
            ) : (
              ''
            )}
          </p>
        </div>
      )
    } else {
      playHtml = <div className={afterStyle.defaultImg} />
    }
    return <div className={afterStyle.videoWrapper}>{playHtml}</div>
  }
}

const mapState = state => ({
  playData: state.afterClass.playData,
  playUrl: state.afterClass.playUrl,
  userName: state.all.userName
})

export default connect(mapState)(Video)
