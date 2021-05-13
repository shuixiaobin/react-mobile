import React, { Component } from 'react'
import { connect } from 'dva'
import Star from './Star'
import detail from '../classDetail.less'

class Introduce extends Component {
  componentDidMount() {
    const { dispatch, location } = this.props
    const search = qs.parse(location.search)
    const { classId } = search
    dispatch({
      type: 'classDetail/getIntroduceList',
      payload: {
        rid: classId
      }
    })
  }

  render() {
    const { introduceList } = this.props
    return (
      <ul className={detail.introduce}>
        {introduceList &&
          introduceList.map(item => (
            <li className={`${detail.intro_item} mt10`} key={item.teacherId}>
              <div className={detail.topWrapper}>
                <img
                  className={`${detail.avatar} br50`}
                  src={item.roundPhoto}
                  alt={item.teacherName}
                />
                <div className={detail.topRight}>
                  <Star starNum={Math.ceil(item.star/2)} score={item.teacherRank} />
                  <span className={detail.title}>{item.SubjectType}</span>
                </div>
              </div>
              <div className={`${detail.introCon} mt20`}>
                <b className={`${detail.name} fz36`}>{item.teacherName}</b>
                <span className={detail.studentNum}>
                  {item.allStudentNum}个学生
                </span>
                <span className={detail.classNum}>
                  {item.payClasses}个在售课程
                </span>
              </div>
              {
                item.Brief ? (
                  <p className={`${detail.desc} mt20`}>{item.Brief}</p>
                ) : null
              }
            </li>
          ))}
      </ul>
    )
  }
}

const mapState = state => ({
  introduceList: state.classDetail.IntroduceList
})

export default connect(mapState)(Introduce)
