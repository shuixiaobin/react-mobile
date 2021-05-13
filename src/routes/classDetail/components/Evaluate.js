import React, { Component } from 'react'
import { connect } from 'dva'
import * as classApi from '@/services/classApi'
import { getEvaluateList } from '@/services/javaApi'
import ListContainer from '@/components/ListContainer/root'
import Star from './Star'
import detail from '../classDetail.less'

function EvaluateItem({ row }) {
  return (
    <li className={`${detail.evaluateItem}`}>
      <div className={`${detail.info}`}>
        <div className={`${detail.infoLeft}`}>
          <img src={row.userFace} className="br50 fl mr10" alt={row.userName} />
          <span className={detail.name}>{row.userName}</span>{' '}
          {row.periods ? (
            <div>
              <span className={detail.line}>|</span>{' '}
              <span>{row.periods}期</span>
            </div>
          ) : (
            ''
          )}
        </div>
        <Star starNum={Math.ceil(row.courseScore)} />
      </div>
      <p className={`${detail.desc} mt20`}>{row.courseRemark}</p>
      <div className={`${detail.buttomInfo} mt20`}>
        <time>{row.rateDate}</time>
        <span className={`${detail.tit} ellipsis`}>{row.lessonTitle}</span>
      </div>
    </li>
  )
}

class Evaluate extends Component {
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

  componentWillReceiveProps(nextProps) {
    const { location } = this.props
    const nextLocation = qs.parse(nextProps.location.search)
    const { classId } = qs.parse(location.search)
    if (nextLocation.classId !== classId) {
      this.initList()
    }
  }

  initList = () => {
    this.onRefresh().then(() => {
      this.listView && this.listView.initList()
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
    const { dispatch, location, classDetailData } = this.props
    const search = qs.parse(location.search)
    const { classId } = search
    const api = classDetailData.lessonType != 3 ?  classApi.getEvaluateList : getEvaluateList
    return dispatch({
      type: 'listView/fetchList',
      payload: {
        api,
        params: {
          classId,
          isLive: 0,
          mine: 0,
          userName: ''
        }
      }
    })
  }

  render() {
    const { total } = this.props
    return (
      <ul className={detail.evaluate}>
        {total ? (
          <h3 className={detail.title}>
            学员评价<span className={`${detail.num} ml10`}>({total})</span>
          </h3>
        ) : null}
        <ListContainer
          triggerRef={ref => {
            this.listView = ref
          }}
          handleRefresh={this.onRefresh}
          handleEndReached={this.onEndReached}
          {...this.props}
        >
          <EvaluateItem />
        </ListContainer>
      </ul>
    )
  }
}

const mapState = state => ({
  total: state.listView.total,
  classDetailData: state.classDetail.classDetail,
})

export default connect(mapState)(Evaluate)
