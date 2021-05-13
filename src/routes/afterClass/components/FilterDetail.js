import React, { Component } from 'react'
import { connect } from 'dva'
import { unDisableScroll } from '@/utils/global'
import detail from '../../classDetail/classDetail.less'

class FilterDetail extends Component {
  getAfterOutline(params) {
    const { dispatch, cv, userName } = this.props
    const {
      afterNodeId,
      beforeNodeId,
      classNodeId,
      coursewareNodeId,
      netClassId,
      nextClassNodeId,
      nextCoursewareNodeId,
      stageNodeId,
      teacherId,
      position
    } = params
    return dispatch({
      type: 'afterClass/getAfterOutline',
      payload: {
        afterNodeId,
        beforeNodeId,
        classNodeId,
        coursewareNodeId,
        cv,
        netClassId,
        nextClassNodeId,
        nextCoursewareNodeId,
        page: 1,
        pageSize: 20,
        parentNodeId: 0,
        stageNodeId,
        teacherId,
        userName,
        position
      }
    })
  }

  getAfterClassList(params) {
    const { dispatch, cv } = this.props
    const { netClassId, stageNodeId } = params
    dispatch({
      type: 'afterClass/getAfterClassList',
      payload: {
        cv,
        netClassId,
        stageNodeId
      }
    })
  }

  getAfterTeacher(params) {
    const { dispatch, cv } = this.props
    const { netClassId, classNodeId, stageNodeId } = params
    dispatch({
      type: 'afterClass/getAfterTeacher',
      payload: {
        cv,
        netClassId,
        classNodeId,
        stageNodeId
      }
    })
  }

  async choose(params) {
    const { type, id } = params
    const { dispatch, filterType, location } = this.props
    const search = qs.parse(location.search)
    const { classId } = search
    switch (type) {
      case 'stage':
        this.getAfterClassList({
          netClassId: classId,
          stageNodeId: id
        })
        this.getAfterTeacher({
          netClassId: classId,
          stageNodeId: id
        })
        this.getAfterOutline({
          netClassId: classId,
          position: 0,
          stageNodeId: id
        })
        break
      case 'class':
        this.getAfterTeacher({
          stageNodeId: filterType.stage ? filterType.stage.id : '',
          netClassId: classId,
          classNodeId: id
        })
        this.getAfterOutline({
          stageNodeId: filterType.stage ? filterType.stage.id : '',
          classNodeId: id,
          netClassId: classId,
          position: 0
        })
        break
      case 'teacher':
        this.getAfterOutline({
          classNodeId: filterType.class ? filterType.class.id : '',
          stageNodeId: filterType.stage ? filterType.stage.id : '',
          netClassId: classId,
          teacherId: id,
          position: 0
        })
        break
      default:
        break
    }
    await Promise.all([
      dispatch({
        type: 'afterClass/setChoose',
        payload: params
      }),
      dispatch({
        type: 'afterClass/setHide'
      })
    ])
  }

  hideDetail() {
    unDisableScroll()
    const { dispatch } = this.props
    dispatch({ type: 'afterClass/setHide' })
  }

  render() {
    const { stageData, classData, afterTeacher, isShow, titleType } = this.props
    let chooseHtml = ''
    let title = ''
    switch (titleType.type) {
      case 'stage':
        title = '基础阶段'
        chooseHtml = stageData.map(item => (
          <li
            className={`${detail.actItem} f32 ${detail.border} ${
              item.isChoose ? detail.hov : ''
            }`}
            key={item.nodeId}
            onClick={() =>
              this.choose({ type: 'stage', id: item.nodeId, name: item.name })
            }
          >
            {item.name}
          </li>
        ))
        break
      case 'class':
        title = '课程名称'
        chooseHtml = classData.map(item => (
          <li
            className={`${detail.actItem} f32 ${detail.border} ${
              item.isChoose ? detail.hov : ''
            }`}
            key={item.classId}
            onClick={() =>
              this.choose({ type: 'class', id: item.nodeId, name: item.name })
            }
          >
            {item.name}
          </li>
        ))
        break
      case 'teacher':
        title = '主讲老师'
        chooseHtml = afterTeacher.map(item => (
          <span
            className={`${detail.teacherItem} fl ${
              item.isChoose ? detail.hov : ''
            }`}
            key={item.teacherId}
            onClick={() =>
              this.choose({
                type: 'teacher',
                id: item.teacherId,
                name: item.teacherName
              })
            }
          >
            {item.teacherName}
          </span>
        ))
        break
      default:
        title = ''
        chooseHtml = ''
        break
    }

    return (
      <div className={`${detail.ActivityDetail} ${isShow ? 'db' : 'dn'}`}>
        <div className={detail.shade} onClick={this.hideDetail.bind(this)} />
        <div className={detail.ActivityDetailWrapper}>
          <h3>
            {title}
            <i
              onClick={this.hideDetail.bind(this)}
              className="iconfont iconCombinedShapex- f32"
            />
          </h3>
          <ul className={`${detail.actList} clearfix f32`}>{chooseHtml}</ul>
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  cv: state.all.cv,
  userName: state.all.userName,
  isShow: state.afterClass.isShow,
  titleType: state.afterClass.titleType,
  stageData: state.afterClass.stageData,
  classData: state.afterClass.classData,
  afterTeacher: state.afterClass.afterTeacher,
  filterType: state.afterClass.filterType
})

export default connect(mapState)(FilterDetail)
