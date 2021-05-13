import React, { Component } from 'react'
import { connect } from 'dva'
import { setCookie } from '@/utils/global'
import { PullToRefresh, ListView, Modal, Toast } from 'antd-mobile'
import { ToApp } from '@/utils/setSensors'
import NoData from '@/components/noData/root'
import afterStyle from '../afterClass.less'
import Filter from './Filter'

class Catalogue extends Component {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })

    this.state = {
      dataSource,
      refreshing: true,
      isLoading: true,
      // height: document.documentElement.clientHeight * 0.8,
      useBodyScroll: true
    }
  }

  componentWillReceiveProps(nextProps) {
    const { afterOutline } = this.props
    const { dataSource } = this.state
    if (
      JSON.stringify(afterOutline) !== JSON.stringify(nextProps.afterOutline)
    ) {
      this.setState({
        dataSource: dataSource.cloneWithRows(nextProps.afterOutline),
        // height: document.documentElement.clientHeight * 0.8,
        refreshing: false,
        isLoading: false
      })
    } else {
      this.setState({
        refreshing: false,
        isLoading: false
      })
    }
  }

  onRefresh = () => {
    const {
      dispatch,
      filterType,
      cv,
      userName,
      initOutline,
      location
    } = this.props
    const search = qs.parse(location.search)
    const { classId } = search
    const beforeNodeId = initOutline[0].id
    this.setState({ refreshing: true, isLoading: true })
    dispatch({
      type: 'afterClass/getAfterOutline',
      payload: {
        beforeNodeId,
        classNodeId: filterType.class ? filterType.class.id : '',
        cv,
        netClassId: classId,
        page: 1,
        pageSize: 20,
        parentNodeId: 0,
        stageNodeId: filterType.stage ? filterType.stage.id : '',
        teacherId: filterType.teacher ? filterType.teacher.id : '',
        userName,
        position: 0,
        isPull: true
      }
    })
  }

  onEndReached = () => {
    const {
      dispatch,
      filterType,
      cv,
      userName,
      initOutline,
      location
    } = this.props
    const { isLoading, hasMore } = this.state
    const search = qs.parse(location.search)
    const { classId } = search
    const afterNodeId = initOutline[initOutline.length - 1].id
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (isLoading && !hasMore) {
      return
    }
    this.setState({ isLoading: true })
    dispatch({
      type: 'afterClass/getAfterOutline',
      payload: {
        afterNodeId,
        classNodeId: filterType.class ? filterType.class.id : '',
        cv,
        netClassId: classId,
        page: 1,
        pageSize: 20,
        parentNodeId: 0,
        stageNodeId: filterType.stage ? filterType.stage.id : '',
        teacherId: filterType.teacher ? filterType.teacher.id : '',
        userName,
        position: 0,
        isEnd: true
      }
    })
  }

  toggle = index => {
    const { dispatch } = this.props
    dispatch({
      type: 'afterClass/toggle',
      payload: {
        index
      }
    })
  }

  handlePlay(data) {
    const { dispatch, location } = this.props
    const search = qs.parse(location.search)
    const { classId, title } = search
    if (data.videoType >= 4) {
      const str =
        data.videoType === 4
          ? '该功能仅华图在线App、PC端支持'
          : '音频课程,请前往华图在线App收听！'
      Modal.alert('', str, [
        { text: '关闭', onPress: () => console.log('cancel') },
        {
          text: '去APP',
          onPress: () => {
            ToApp({
              on_page: '课程详情页',
              course_title: data.title
            })
            window.location.href = `//ns.huatu.com/h5/index.html?rid=${classId}&type=4`
          }
        }
      ])
    } else if (data.videoType === 2 && data.liveStart > 0) {
      Toast.info('直播尚未开始，请您耐心等待！')
    } else {
      dispatch({
        type: 'afterClass/setCurrentPlay',
        payload: data
      })
      const currentPlay = {}
      currentPlay.bjyRoomId = data.bjyRoomId
      currentPlay.bjySessionId = data.bjySessionId
      currentPlay.token = data.token
      currentPlay.videoType = data.videoType
      currentPlay.videoId = data.videoId
      currentPlay.title = data.title
      currentPlay.parentId = data.parentId
      currentPlay.lessonId = data.coursewareId
      currentPlay.classId = data.classId
      currentPlay.liveStart = data.liveStart
      currentPlay.title = data.title
      currentPlay.domainName = data.domainName
      currentPlay.isBringGoods = data.isBringGoods
      currentPlay.liveStatus = data.liveStatus
      currentPlay.className = title
      setCookie('coursewareId', data.coursewareId)
      sessionStorage.setItem('playData', JSON.stringify(currentPlay))
    }
  }

  handleAlert(e, title, subjectType, flag) {
    const { location } = this.props
    const search = qs.parse(location.search)
    const { classId } = search
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
    let msg = '该功能仅华图在线App、PC端支持'
    if (subjectType === 2) {
      msg = '请前往华图在线App体验此功能'
    }
    Modal.alert('', msg, [
      { text: '关闭', onPress: () => console.log('cancel') },
      {
        text: '去APP',
        onPress: () => {
          window.location.href = `//ns.huatu.com/h5/index.html?rid=${classId}&type=4`
        }
      }
    ])
  }

  render() {
    const {
      useBodyScroll,
      dataSource,
      isLoading,
      refreshing,
      height
    } = this.state
    const { afterOutline, isEmpty } = this.props
    const row = (rowData, fill, rowId) => {
      if (rowData.hasChildren) {
        return (
          <div className={`${afterStyle.twoLevel} pt20`} key={rowData.id}>
            <div
              className={afterStyle.titleBox}
              onClick={this.toggle.bind(this, rowId)}
            >
              <h3 className={`${afterStyle.title} f28 ellipsis`}>
                {rowData.title}
              </h3>
              <i
                className={`iconfont ${
                  rowData.isOpen ? 'iconshanglabeifen' : 'iconxiala2'
                }`}
              />
            </div>
            <div className={`${rowData.isOpen ? 'db' : 'dn'}`}>
              {rowData.children &&
                rowData.children.map(each => (
                  <div className={`${afterStyle.container}`} key={each.id}>
                    <div
                      className="clearfix"
                      onClick={this.handlePlay.bind(this, each)}
                    >
                      <span
                        className={`${afterStyle.num} fl f32 ${
                          each.lastStudy ||
                          each.positionLiveNode ||
                          each.isCurrent
                            ? afterStyle.hov
                            : ''
                        }`}
                      >
                        {each.serialNumber}
                      </span>
                      <div className={afterStyle.topWrapper}>
                        <h5
                          className={`${
                            afterStyle.oneLevelTit
                          } ellipsis mr20 f28 ${
                            each.lastStudy ||
                            each.positionLiveNode ||
                            each.isCurrent
                              ? afterStyle.hov
                              : ''
                          }`}
                        >
                          {each.title}
                        </h5>
                      </div>
                      {each.videoType !== 4 ? (
                        <div className={`${afterStyle.titleWrapper} fl`}>
                          <div className={afterStyle.desc}>
                            {each.videoType === 2 && each.liveStatus === 1 ? (
                              <span
                                className={`${afterStyle.living} ${afterStyle.classDesc}`}
                              >
                                直播中
                              </span>
                            ) : (
                              <span className={afterStyle.classDesc}>
                                {each.videoLength}
                              </span>
                            )}
                            {each.teacherNames &&
                            each.teacherNames.length > 0 ? (
                              <span
                                className={`${afterStyle.teacher} ellipsis`}
                              >
                                主讲老师：{each.teacherNames.join(',')}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {each.afterCoreseNum !== 0 || each.studyReport ? (
                      <div className="clearfix mt30">
                        {each.afterCoreseNum > 0 ? (
                          <div
                            className={`${afterStyle.resultItem} fl `}
                            onClick={e =>
                              this.handleAlert(
                                e,
                                each.title,
                                each.subjectType,
                                true
                              )
                            }
                          >
                            <i className="iconfont iconzuoyex f24 mr10" />
                            课后作业
                            <span className={afterStyle.redWord}>
                              练习题-{each.afterCoreseNum}道题
                            </span>
                          </div>
                        ) : (
                          ''
                        )}
                        {each.studyReport ? (
                          <div
                            className={`${afterStyle.resultItem} fl ml20`}
                            onClick={e =>
                              this.handleAlert(
                                e,
                                each.title,
                                each.subjectType,
                                false
                              )
                            }
                          >
                            <i className="iconfont iconxuexibaogaoiconx f24 mr10" />
                            学习报告
                            {/* <span
                              className={`${afterStyle.redWord} ${
                                afterStyle.normalword
                              }`}
                            >
                              未生成
                            </span> */}
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                ))}
            </div>
          </div>
        )
      }
      if (!rowData.hasChildren) {
        return (
          <div className={`${afterStyle.container}`} key={rowData.id}>
            <div
              className="clearfix"
              onClick={this.handlePlay.bind(this, rowData)}
            >
              <span
                className={`${afterStyle.num} fl f32 ${
                  rowData.lastStudy || rowData.isCurrent ? afterStyle.hov : ''
                }`}
              >
                {rowData.serialNumber}
              </span>
              <div className={afterStyle.topWrapper}>
                <h5
                  className={`${afterStyle.oneLevelTit} ellipsis mr20 f28 ${
                    rowData.lastStudy || rowData.isCurrent ? afterStyle.hov : ''
                  }`}
                >
                  {rowData.title}
                </h5>
              </div>
              {rowData.videoType !== 4 ? (
                <div className={`${afterStyle.titleWrapper} fl`}>
                  <div className={afterStyle.desc}>
                    {rowData.videoType === 2 && rowData.liveStatus === 1 ? (
                      <span
                        className={`${afterStyle.living} ${afterStyle.classDesc}`}
                      >
                        直播中
                      </span>
                    ) : (
                      <span className={afterStyle.classDesc}>
                        {rowData.videoLength}
                      </span>
                    )}
                    {rowData.teacherNames && rowData.teacherNames.length > 0 ? (
                      <span className={`${afterStyle.teacher} ellipsis`}>
                        主讲老师：{rowData.teacherNames.join(',')}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
            {rowData.afterCoreseNum !== 0 || rowData.studyReport ? (
              <div className="clearfix mt30">
                {rowData.afterCoreseNum > 0 ? (
                  <div
                    className={`${afterStyle.resultItem} fl `}
                    onClick={e =>
                      this.handleAlert(
                        e,
                        rowData.title,
                        rowData.subjectType,
                        true
                      )
                    }
                  >
                    <i className="iconfont iconzuoyex f24 mr10" />
                    课后作业
                    <span className={afterStyle.redWord}>
                      练习题-{rowData.afterCoreseNum}道题
                    </span>
                  </div>
                ) : (
                  ''
                )}
                {rowData.studyReport ? (
                  <div
                    className={`${afterStyle.resultItem} fl ml20`}
                    onClick={e =>
                      this.handleAlert(
                        e,
                        rowData.title,
                        rowData.subjectType,
                        false
                      )
                    }
                  >
                    <i className="iconfont iconxuexibaogaoiconx f24 mr10" />
                    学习报告
                    {/* <span
                      className={`${afterStyle.redWord} ${
                        afterStyle.normalword
                      }`}
                    >
                      未生成
                    </span> */}
                  </div>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}
          </div>
        )
      }
      return ''
    }
    return (
      <div className={afterStyle.catalogue}>
        <Filter />
        <div className="wrapper">
          {afterOutline.length !== 0 ? (
            <ListView
              key={useBodyScroll ? '0' : '1'}
              ref={el => (this.lv = el)}
              dataSource={dataSource}
              renderFooter={() =>
                isLoading ? (
                  <div style={{ padding: 10, textAlign: 'center' }}>
                    {isLoading ? 'Loading...' : 'Loaded'}
                  </div>
                ) : (
                  ''
                )
              }
              renderRow={row}
              useBodyScroll={useBodyScroll}
              // style={{ height }}
              pullToRefresh={
                <PullToRefresh
                  refreshing={refreshing}
                  onRefresh={this.onRefresh}
                />
              }
              onEndReached={this.onEndReached}
              onEndReachedThreshold={10}
              pageSize={20}
            />
          ) : null}
          {afterOutline.length === 0 && isEmpty ? (
            <NoData desc="暂无课程大纲" />
          ) : null}
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  afterOutline: state.afterClass.afterOutline,
  filterType: state.afterClass.filterType,
  cv: state.all.cv,
  userName: state.all.userName,
  initOutline: state.afterClass.initOutline,
  isEmpty: state.afterClass.isEmpty
})

export default connect(mapState)(Catalogue)
