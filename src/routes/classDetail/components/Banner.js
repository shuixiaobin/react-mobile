import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal } from 'antd-mobile'
import CountDown from '@/components/CountDown/root'
import detail from '../classDetail.less'

function CountDownFn(props) {
  const { classIntro, dispatch } = props;
  const updatedFn = () => {
    dispatch({
      type: 'classDetail/setUpdateFlag',
      payload: true
    })
  }
  // 倒计时优先级：优先显示停售倒计时，其次显示抢购倒计时，最后是活动倒计时
  if (
    classIntro.isRushClass ||
    (classIntro.isRushClass && classIntro.isDiscount)
  ) {
    if (classIntro.saleStart > 0) {
      return (
        <div className={`${detail.timeLimit} ${detail.bg3}`}>
          <CountDown
            beforeDesc="剩"
            time={classIntro.saleStart}
            updatedFn={() => updatedFn()}
            afterDesc="开抢"
          />
        </div>
      )
    }
    if (classIntro.saleEnd > 0 && classIntro.saleStart === 0) {
      return (
        <div className={`${detail.timeLimit} ${detail.bg2}`}>
          <CountDown
            beforeDesc="剩"
            updatedFn={() => updatedFn()}
            time={classIntro.saleEnd}
            afterDesc="停售"
          />
        </div>
      )
    }
    return null
  }
  if (classIntro.isDiscount) {
    if (
      !classIntro.activityEndTime &&
      Number(classIntro.activityStartTime) > 0
    ) {
      return (
        <div className={`${detail.timeLimit} `}>
          <CountDown
            beforeDesc="剩"
            time={classIntro.activityStartTime}
            updatedFn={() => updatedFn()}
            afterDesc="恢复原价"
          />
        </div>
      )
    }
    if (
      Number(classIntro.activityEndTime) > 0 &&
      !classIntro.activityStartTime
    ) {
      return (
        <div className={`${detail.timeLimit} `}>
          <CountDown
            beforeDesc="剩"
            time={classIntro.activityEndTime}
            updatedFn={() => updatedFn()}
            afterDesc="恢复原价"
          />
        </div>
      )
    }
    return null
  }
  return null
}
class Banner extends Component {
  playHandle() {
    const { classIntro, dispatch } = this.props
    dispatch({
      type: 'classDetail/setCurrentAudition',
      payload: {
        videoType: classIntro.videoType,
        token: classIntro.token,
        videoId: classIntro.videoId,
        domainName: classIntro.domainName
      }
    })
  }

  playAudition() {
    const { auditionList, dispatch, location } = this.props
    const search = qs.parse(location.search)
    const { classId } = search
    const item = auditionList[0]
    if (item.videoType === 5) {
      Modal.alert('', '音频课程，请前往华图在线App收听！', [
        { text: '关闭', onPress: () => console.log('cancel') },
        {
          text: '去APP',
          onPress: () => {
            window.location.href = `//ns.huatu.com/h5/index.html?rid=${classId}&type=4`
          }
        }
      ])
    }
    dispatch({
      type: 'classDetail/setCurrentAudition',
      payload: {
        videoType: item.videoType,
        token: item.token,
        videoId: item.videoId,
        bjyRoomId: item.bjyRoomId,
        bjySessionId: item.bjySessionId,
        domainName: item.domainName
      }
    })
  }


  

  render() {
    // playAuditionFlag, url
    const { classIntro, auditionList } = this.props
    // const { isPlay } = this.state
    return (
      <div className={detail.bannerCon}>
        <img
          className={detail.banner}
          src={
            classIntro.scaleimg ||
            '//p.htwx.net/images/course_default_500x360.jpg'
          }
          alt={classIntro.classTitle}
        />
        {JSON.stringify(classIntro) !== '{}' && <CountDownFn {...this.props} />}
        {(classIntro.videoId && classIntro.token) ||
        auditionList.length !== 0 ? (
          <div className={detail.shadeBox}>
            {classIntro.videoId && classIntro.token ? (
              <div
                className={detail.class_intro}
                onClick={this.playHandle.bind(this)}
              >
                <span className={detail.title}>课程介绍</span>
                <i className={`${detail.play} iconfont  iconbofang- fr`} />
              </div>
            ) : null}
            {classIntro.videoId &&
            classIntro.token &&
            auditionList.length !== 0 ? (
              <div
                className={detail.freeLestion}
                onClick={this.playAudition.bind(this)}
              >
                免费试听
                <i className={`${detail.ml7} iconfont iconGroupCopyx- f24`} />
              </div>
            ) : !classIntro.videoId &&
              !classIntro.token &&
              auditionList.length !== 0 ? (
                <div
                  className={detail.class_intro}
                  onClick={this.playAudition.bind(this)}
                >
                  <span className={detail.title}>免费试听</span>
                  <i className={`${detail.play} iconfont  iconbofang- fr`} />
                </div>
            ) : null}
          </div>
        ) : null}
        {/* {playAuditionFlag ||
        (classIntro.videoId && classIntro.token && isPlay) ? (
          <iframe
            className={detail.video}
            title={detail.title}
            src={url}
            frameBorder="0"
          />
        ) : (
          ''
        )} */}
      </div>
    )
  }
}

const mapState = state => ({
  classIntro: state.classDetail.classIntro,
  auditionList: state.classDetail.auditionList,
  url: state.classDetail.url
  // playAuditionFlag: state.classDetail.playAuditionFlag
})

export default connect(mapState)(Banner)
