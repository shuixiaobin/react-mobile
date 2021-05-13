import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal } from 'antd-mobile'
import { routerRedux } from 'dva/router'
import { getMyClass } from '@/services/myClass'
import { ToApp } from '@/utils/setSensors'

import ListContainer from '@/components/ListContainer/root'
import style from '../myClass.less'

function ClassItem({ row, ...props }) {
  const { url, dispatch } = props
  function goOnetoOne(
    e,
    oneToOne,
    classId,
    orderNum,
    title,
    NetClassCategoryId,
    newTeacherOneToOne
  ) {
    e.stopPropagation()
    let type = 1
    if (oneToOne === 1) {
      if (
        NetClassCategoryId !== '12' &&
        NetClassCategoryId !== '19' &&
        NetClassCategoryId !== '21'
      ) {
        type = 2
      }
      Modal.alert(
        '',
        '此课程包含1对1内容，请尽快填写学员信息。学员可通过填写信息卡预约上课时间，上课老师等。若90天未填写学员信息卡，课程将失效且无法退款。',
        [
          { text: '取消', onPress: () => console.log('cancel') },
          {
            text: '去填写',
            onPress: () =>
              dispatch(
                routerRedux.push({
                  pathname: '/user/onetoone',
                  search: qs.stringify({
                    oneToOne,
                    rid: classId,
                    OrderNum: orderNum,
                    NetClassName: encodeURI(title),
                    type,
                    NetClassCategoryId
                  })
                })
              )
          }
        ]
      )
    } else if (oneToOne === 2) {
      if (
        NetClassCategoryId !== '12' &&
        NetClassCategoryId !== '19' &&
        NetClassCategoryId !== '21' &&
        !newTeacherOneToOne
      ) {
        type = 2
      }
      dispatch(
        routerRedux.push({
          pathname: '/user/onetoone',
          search: qs.stringify({
            oneToOne,
            rid: classId,
            OrderNum: orderNum,
            NetClassName: encodeURI(title),
            type,
            NetClassCategoryId
          })
        })
      )
    }
  }
  function goAfterClass(
    classId,
    orderDePrice,
    title,
    oneToOne,
    orderNum,
    NetClassCategoryId,
    classType
  ) {
    if (oneToOne === 1) {
      let type = 1
      if (
        oneToOne === 1 &&
        NetClassCategoryId !== '12' &&
        NetClassCategoryId !== '19' &&
        NetClassCategoryId !== '21'
      ) {
        type = 2
      }

      Modal.alert(
        '',
        '此课程包含1对1内容，请尽快填写学员信息。学员可通过填写信息卡预约上课时间，上课老师等。若90天未填写学员信息卡，课程将失效且无法退款。',
        [
          { text: '取消', onPress: () => console.log('cancel') },
          {
            text: '去填写',
            onPress: () =>
              dispatch(
                routerRedux.push({
                  pathname: '/user/onetoone',
                  search: qs.stringify({
                    oneToOne,
                    rid: classId,
                    OrderNum: orderNum,
                    NetClassName: encodeURI(title),
                    type
                  })
                })
              )
          }
        ]
      )
    } else if (Number(orderDePrice) < 100) {
      dispatch(
        routerRedux.push({
          pathname: '/class/afterClass',
          search: qs.stringify({
            classId,
            classType,
            title: encodeURI(title)
          })
        })
      )
    } else {
      Modal.alert('', '付费课程可享受更多服务，请前往华图在线APP/PC端听课', [
        { text: '知道了', onPress: () => console.log('cancel') },
        {
          text: '去APP',
          onPress: () => {
            ToApp({
              on_page: '我的课程页',
              course_title: title
            })
            window.location.href = `//ns.huatu.com/h5/index.html?classId=${classId}&type=12&classType=${classType}`
          }
        }
      ])
    }
  }
  return (
    <div
      className={style.classItem}
      onClick={() =>
        goAfterClass(
          row.classId,
          row.orderDePrice,
          row.title,
          row.oneToOne,
          row.orderNum,
          row.NetClassCategoryId,
          row.classType
        )
      }
    >
      <h4 className={`${style.classTitle}`}>{row.title}</h4>
      {/* <span className={style.time}>5月19日-8月21日 共520课时</span> */}
      {row.oneToOne !== 0 ? (
        <span
          className={style.oneToone}
          onClick={e =>
            goOnetoOne(
              e,
              row.oneToOne,
              row.classId,
              row.orderNum,
              row.title,
              row.NetClassCategoryId,
              row.newTeacherOneToOne
            )
          }
        >
          1对1信息表
          <i className="iconfont iconbianzux3" />
        </span>
      ) : null}
      {row.todayLive ? (
        <img
          className={style.liveIcon}
          src={`${url}liveIcon.png`}
          alt={row.title}
        />
      ) : null}
      <div className="clearfix mt30">
        <div className={`${style.teacherList} fl`}>
          {row.teacherImg.slice(0, 3).map((item, index) => (
            <div className={style.teacherItem} key={index}>
              <img
                className="br50"
                src={item.roundPhoto}
                alt={item.teacherName}
              />
              <span className={style.teacherName}>{item.teacherName}</span>
            </div>
          ))}
        </div>
        {/* <div className={`${style.progressWrapper} fr`}>
          <h6 className={style.progressTit}>{row.descString}</h6>
          <div className={`${style.progress} clearfix`}>
            <div className={`${style.all} fl`}>
              <div
                className={style.used}
                style={{ width: `${row.totalSchedule}%` }}
              />
            </div>
            <span className={`${style.word} fr`}>已学{row.totalSchedule}%</span>
          </div>
        </div> */}
      </div>
    </div>
  )
}

class ClassList extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    this.initList()
    dispatch({
      type: 'listView/SET_LIST_OPTIONS',
      payload: {
        height: document.documentElement.clientHeight * 0.8,
        isWingBlank: true,
        isPullToRefresh: true,
        isUpToRefresh: true
      }
    })
  }

  componentWillReceiveProps() {
    const { dispatch } = this.props
    return dispatch({ type: 'listView/resetList' }).then(() =>
      this.onEndReached()
    )
  }

  initList = () => {
    this.onRefresh().then(() => {
      this.listView.initList()
    })
  }

  /**
   * 下拉刷新
   */
  onRefresh = () => {
    const { dispatch } = this.props
    return dispatch({ type: 'listView/resetList' }).then(() =>
      this.onEndReached()
    )
  }

  /**
   * 上拉加载
   */
  onEndReached = () => {
    const {
      dispatch,
      examTypeStr,
      priceAttributeStr,
      speakTeacherStr,
      selectVal,
      userName
    } = this.props
    return dispatch({
      type: 'listView/fetchList',
      payload: {
        api: getMyClass,
        params: {
          examStatus: examTypeStr,
          recentlyStudy: selectVal.val,
          priceStatus: priceAttributeStr,
          teacherId: speakTeacherStr,
          userName
        }
      }
    })
  }

  render() {
    return (
      <ListContainer
        triggerRef={ref => {
          this.listView = ref
        }}
        handleRefresh={this.onRefresh}
        handleEndReached={this.onEndReached}
        {...this.props}
      >
        <ClassItem {...this.props} />
      </ListContainer>
    )
  }
}

const mapState = state => ({
  url: state.all.myUrl,
  examTypeStr: state.myClass.examTypeStr,
  priceAttributeStr: state.myClass.priceAttributeStr,
  speakTeacherStr: state.myClass.speakTeacherStr,
  selectVal: state.myClass.selectVal,
  userName: state.all.userName
})

export default connect(mapState)(ClassList)
