import React, { Component } from 'react'
import { connect } from 'dva'
import NoData from '@/components/noData/root'
import afterStyle from '../afterClass.less'

class Lecture extends Component {
  componentDidMount() {
    const { dispatch, userName, location } = this.props
    const search = qs.parse(location.search)
    const { classId } = search
    dispatch({
      type: 'afterClass/getHandouts',
      payload: {
        classId,
        userName
      }
    })
  }

  toggle(key) {
    const { dispatch } = this.props
    dispatch({
      type: 'afterClass/toggleLecture',
      payload: key
    })
  }

  render() {
    const { myUrl, handouts } = this.props

    return (
      <div className={`${afterStyle.lecture}`}>
        {Array.isArray(handouts) ? (
          <NoData desc="暂无讲义" />
        ) : (
          Object.keys(handouts).map(key => (
            <div key={key}>
              <div
                className={`${afterStyle.lectureTitleWrapper} clearfix`}
                onClick={this.toggle.bind(this, key)}
              >
                <h3 className={`${afterStyle.lectureTitle} ellipsis fl f28`}>
                  {handouts[key].title}
                </h3>
                <i
                  className={`iconfont ${
                    handouts[key].isOpen ? 'iconshanglabeifen' : 'iconxiala2'
                  } fr`}
                />
              </div>
              <div className={`${handouts[key].isOpen ? 'db' : 'dn'}`}>
                {handouts[key].list.map(item => (
                  <a
                    className={afterStyle.lectureItem}
                    key={item.rid}
                    href={item.fileUrl}
                  >
                    <div className={afterStyle.leftCon}>
                      <img src={`${myUrl}pdf.png`} alt={item.title} />
                      <span className={`${afterStyle.size} f20`}>
                        {item.fileSize}M
                      </span>
                    </div>
                    <p className={afterStyle.title}>{item.title}</p>
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    )
  }
}

const mapState = state => ({
  myUrl: state.all.myUrl,
  userName: state.all.userName,
  handouts: state.afterClass.handouts
})

export default connect(mapState)(Lecture)
