import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal } from 'antd-mobile'
import NoData from '@/components/noData/root'
import { ToApp } from '@/utils/setSensors'
import AuditionCell from './AuditionCell'
import detail from '../classDetail.less'

class Outline extends Component {
  constructor(props) {
    super(props)
    this.state = {
      classId: null
    }
  }

  componentDidMount() {
    const { location } = this.props
    const search = qs.parse(location.search)
    const { classId } = search
    this.setState(
      {
        classId
      },
      () => {
        this.getOutlineFn()
      }
    )
  }

  componentWillReceiveProps(nextProps) {
    const { location } = this.props
    const nextLocation = qs.parse(nextProps.location.search)
    const { classId } = qs.parse(location.search)
    if (nextLocation.classId !== classId) {
      this.setState(
        {
          classId: nextLocation.classId
        },
        () => {
          this.getOutlineFn()
        }
      )
    }
  }

  getOutlineFn(id, page, isOpen, index, j) {
    const { dispatch } = this.props
    const { classId } = this.state
    if (!isOpen) {
      dispatch({
        type: 'classDetail/getOutline',
        payload: {
          httpParams: {
            classId,
            pageSize: 20,
            page: page || 1,
            parentId: id || 0
          },
          outlineParams: {
            index,
            j,
            page
          }
        }
      })
    } else {
      dispatch({
        type: 'classDetail/closeOutline',
        payload: {
          index,
          j
        }
      })
    }
  }

  getChildData(id, page, isOpen, index, j) {
    this.getOutlineFn(id, page, isOpen, index, j)
  }

  addMore(id, page, index, j) {
    const { dispatch } = this.props
    const { classId } = this.state
    page++
    dispatch({
      type: 'classDetail/getOutline',
      payload: {
        httpParams: {
          classId,
          pageSize: 20,
          page: page || 1,
          parentId: id || 0
        },
        outlineParams: {
          index,
          j,
          page,
          add: true
        }
      }
    })
  }

  handleAlert(e, title, flag) {
    const { classId } = this.state
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
          window.location.href = `//ns.huatu.com/h5/index.html?rid=${classId}&type=4`
        }
      }
    ])
  }

  auditionHandle(videoType, token, videoId, bjyRoomId, bjySessionId, isTrial,domainName) {
    const { dispatch } = this.props
    const { classId } = this.state
    if (isTrial) {
      if (videoType === 5 ) {
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
  }

  render() {
    const { outlineData } = this.props

    let outlineHtml
    if (
      JSON.stringify(outlineData) !== '{}' &&
      outlineData.list &&
      outlineData.list[0] &&
      outlineData.list[0].type === 0
    ) {
      // 三层结构大纲
      outlineHtml = (
        <div className={detail.outline}>
          {JSON.stringify(outlineData) !== '{}' &&
            outlineData.list &&
            outlineData.list.map((item, index) => (
              <div className={detail.threeLevel} key={item.id}>
                <div
                  className={detail.title}
                  onClick={this.getChildData.bind(
                    this,
                    item.id,
                    item.page,
                    item.isOpen,
                    index,
                    undefined
                  )}
                >
                  <h3 className={`${detail.threeLevelTit} ellipsis`}>
                    {item.title}
                  </h3>
                  <i
                    className={`iconfont  ${
                      item.isOpen ? 'iconshanglabeifen' : 'iconxiala2'
                    }`}
                  />
                </div>
                {item.children &&
                  item.children.list.map((each, j) => (
                    <ul
                      className={`${detail.twoLevel} ${
                        item.isOpen ? 'db' : 'dn'
                      }`}
                      key={each.id}
                    >
                      <div
                        className={detail.title}
                        onClick={this.getChildData.bind(
                          this,
                          each.id,
                          each.page,
                          each.isOpen,
                          index,
                          j
                        )}
                      >
                        <h4 className={`${detail.twoLevelTit} ellipsis`}>
                          {each.title}
                        </h4>
                        <i
                          className={`iconfont  ${
                            each.isOpen ? 'iconshanglabeifen' : 'iconxiala2'
                          }`}
                        />
                      </div>
                      <li
                        className={`${detail.oneLevel} ${
                          each.isOpen ? 'db' : 'dn'
                        }`}
                      >
                        {each.children &&
                          each.children.list.map((every, k) => (
                            <div
                              key={every.id}
                              className={`${detail.container}`}
                              onClick={this.auditionHandle.bind(
                                this,
                                every.videoType,
                                every.token,
                                every.videoId,
                                every.bjyRoomId,
                                every.bjySessionId,
                                every.isTrial,
                                every.domainName
                              )}
                            >
                              <div className={detail.flexWrapper}>
                                <span className={`${detail.num}`}>
                                  {every.serialNumber}
                                </span>
                                <div className={`${detail.titleWrapper}`}>
                                  <div className={detail.topWrapper}>
                                    <h5
                                      className={`${detail.oneLevelTit} ellipsis mr20`}
                                    >
                                      {every.title}
                                    </h5>
                                    <span
                                      className={`${detail.audition} ${
                                        every.isTrial ? 'db' : 'dn'
                                      }`}
                                    >
                                      试听
                                    </span>
                                  </div>
                                  {every.videoType !== 4 ? (
                                    <div className={detail.desc}>
                                      <span className={detail.classDesc}>
                                        {every.videoLength}
                                      </span>
                                      <span
                                        className={`${detail.teacher} ellipsis`}
                                      >
                                        主讲老师：{every.teacher}
                                      </span>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              {every.afterCoreseNum !== 0 ||
                              every.studyReport ? (
                                <div className="clearfix mt20">
                                  {every.afterCoreseNum > 0 ? (
                                    <div
                                      className={`${detail.resultItem} fl `}
                                      onClick={e =>
                                        this.handleAlert(e, every.title, true)
                                      }
                                    >
                                      <i className="iconfont iconzuoyex f24 mr10" />
                                      课后作业
                                      <span className={detail.redWord}>
                                        练习题-{every.afterCoreseNum}道题
                                      </span>
                                    </div>
                                  ) : null}
                                  {every.studyReport ? (
                                    <div
                                      className={`${detail.resultItem} fl ml20`}
                                      onClick={e =>
                                        this.handleAlert(e, every.title, false)
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
                        {each.children && each.children.next !== 0 ? (
                          <div
                            className={detail.addMore}
                            onClick={this.addMore.bind(
                              this,
                              each.id,
                              each.page,
                              index,
                              j
                            )}
                          >
                            加载更多
                          </div>
                        ) : null}
                      </li>
                    </ul>
                  ))}
              </div>
            ))}
        </div>
      )
    } else if (
      JSON.stringify(outlineData) !== '{}' &&
      outlineData.list &&
      outlineData.list[0] &&
      outlineData.list[0].type === 1
    ) {
      // 二层结构大纲
      outlineHtml = (
        <div className={detail.outline}>
          {outlineData.list.map((each, j) => (
            <ul className={`${detail.twoLevel}`} key={each.id}>
              <div
                className={detail.title}
                onClick={this.getChildData.bind(
                  this,
                  each.id,
                  each.page,
                  each.isOpen,
                  j,
                  undefined
                )}
              >
                <h4 className={`${detail.twoLevelTit} ellipsis`}>
                  {each.title}
                </h4>
                <i
                  className={`iconfont  ${
                    each.isOpen ? 'iconshanglabeifen' : 'iconxiala2'
                  }`}
                />
              </div>
              <li className={`${detail.oneLevel} ${each.isOpen ? 'db' : 'dn'}`}>
                {each.children &&
                  each.children.list.map((every, k) => (
                    <div
                      key={every.id}
                      className={`${detail.container} clearfix`}
                      onClick={this.auditionHandle.bind(
                        this,
                        every.videoType,
                        every.token,
                        every.videoId,
                        every.bjyRoomId,
                        every.bjySessionId,
                        every.isTrial,
                        every.domainName
                      )}
                    >
                      <div className={detail.flexWrapper}>
                        <span className={`${detail.num}`}>
                          {every.serialNumber}
                        </span>
                        <div className={`${detail.titleWrapper}`}>
                          <div className={detail.topWrapper}>
                            <h5
                              className={`${detail.oneLevelTit} ellipsis mr20`}
                            >
                              {every.title}
                            </h5>
                            <span
                              className={`${detail.audition} ${
                                every.isTrial ? 'db' : 'dn'
                              }`}
                            >
                              试听
                            </span>
                          </div>
                          {every.videoType !== 4 ? (
                            <div className={detail.desc}>
                              <span className={detail.classDesc}>
                                {every.videoLength}
                              </span>
                              <span className={`${detail.teacher} ellipsis`}>
                                主讲老师：{every.teacher}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      {every.afterCoreseNum !== 0 || every.studyReport ? (
                        <div className="clearfix mt20">
                          {every.afterCoreseNum > 0 ? (
                            <div
                              className={`${detail.resultItem} fl `}
                              onClick={e =>
                                this.handleAlert(
                                  e,
                                  every.classId,
                                  every.title,
                                  true
                                )
                              }
                            >
                              <i className="iconfont iconzuoyex f24 mr10" />
                              课后作业
                              <span className={detail.redWord}>
                                练习题-{every.afterCoreseNum}道题
                              </span>
                            </div>
                          ) : null}
                          {every.studyReport ? (
                            <div
                              className={`${detail.resultItem} fl ml20`}
                              onClick={e =>
                                this.handleAlert(e, every.title, false)
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
                {each.children && each.children.next !== 0 ? (
                  <div
                    className={detail.addMore}
                    onClick={this.addMore.bind(
                      this,
                      each.id,
                      each.page,
                      j,
                      undefined
                    )}
                  >
                    加载更多
                  </div>
                ) : null}
              </li>
            </ul>
          ))}
        </div>
      )
    } else if (
      JSON.stringify(outlineData) !== '{}' &&
      outlineData.list &&
      outlineData.list[0] &&
      outlineData.list[0].type === 2
    ) {
      // 一层结构大纲
      outlineHtml = (
        <div className={detail.outline}>
          <div className={`${detail.oneLevel}`}>
            {outlineData.list.map((every, k) => (
              <div
                key={every.id}
                className={`${detail.container} clearfix`}
                onClick={this.auditionHandle.bind(
                  this,
                  every.videoType,
                  every.token,
                  every.videoId,
                  every.bjyRoomId,
                  every.bjySessionId,
                  every.isTrial,
                  every.domainName
                )}
              >
                <div className={detail.flexWrapper}>
                  <span className={`${detail.num}`}>
                    {every.serialNumber}
                  </span>
                  <div className={`${detail.titleWrapper}`}>
                    <div className={detail.topWrapper}>
                      <h5 className={`${detail.oneLevelTit} ellipsis mr20`}>
                        {every.title}
                      </h5>
                      <span
                        className={`${detail.audition} ${
                          every.isTrial ? 'db' : 'dn'
                        }`}
                      >
                        试听
                      </span>
                    </div>
                    {every.videoType !== 4 ? (
                      <div className={detail.desc}>
                        <span className={detail.classDesc}>
                          {every.videoLength}
                        </span>
                        <span className={`${detail.teacher} ellipsis`}>
                          主讲老师：{every.teacher}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
                {every.afterCoreseNum !== 0 || every.studyReport ? (
                  <div className="clearfix mt20">
                    {every.afterCoreseNum > 0 ? (
                      <div
                        className={`${detail.resultItem} fl `}
                        onClick={e => this.handleAlert(e, every.title, true)}
                      >
                        <i className="iconfont iconzuoyex f24 mr10" />
                        课后作业
                        <span className={detail.redWord}>
                          练习题-{every.afterCoreseNum}道题
                        </span>
                      </div>
                    ) : null}
                    {every.studyReport ? (
                      <div
                        className={`${detail.resultItem} fl ml20`}
                        onClick={e => this.handleAlert(e, every.title, false)}
                      >
                        <i className="iconfont iconxuexibaogaoiconx f24 mr10" />
                        学习报告
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
            {outlineData.next !== 0 ? (
              <div
                className={detail.addMore}
                onClick={this.addMore.bind(
                  this,
                  undefined,
                  outlineData.list[outlineData.list.length - 1].page,
                  undefined,
                  undefined
                )}
              >
                加载更多
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      )
    } else {
      return (
        <NoData
          desc="暂无课程大纲"
          setHeight={document.documentElement.clientHeight * 0.5}
        />
      )
    }

    return (
      <div>
        <AuditionCell {...this.props} />
        {outlineHtml}
      </div>
    )
  }
}
const mapState = state => ({
  outlineData: state.classDetail.outlineData
})

export default connect(mapState)(Outline)
