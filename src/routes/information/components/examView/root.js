import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import inforExam from '../information.less'

class ExamView extends Component {
  state = {}

  choose = e => {
    const li = closest(e.target, 'li') || ''
    const { dispatch, viewClose } = this.props

    if (li) {
      const { k, v } = li.dataset

      dispatch({
        type: 'information/setFilterType',
        payload: {
          key: 'exam',
          k,
          v
        }
      }).then(() => viewClose())
    }
  }

  render() {
    const { examType, ispull, exam } = this.props

    return ispull ? (
      <div
        style={{
          maxHeight: document.documentElement.clientHeight
        }}
        className={`${inforExam.examView}`}
        onClick={this.choose}
      >
        {examType
          ? Object.keys(examType).map(key => (
            <div key={key}>
              <div
                  className={`${inforExam.type_title} ${
                    key === '0' ? 'dn' : 'db'
                  } f28`}
                >
                  {key}
                </div>
              <ul className={`${inforExam.type_list} oh f28`}>
                  {examType[key].map(item => (
                    <li
                      className={`${exam.v === item.v ? 'choose_li' : ''} fl`}
                      key={item.k}
                      data-k={item.k}
                      data-v={item.v}
                    >
                      {item.v}
                    </li>
                  ))}
                </ul>
            </div>
            ))
          : null}
      </div>
    ) : null
  }
}

const mapState = state => ({
  examType: state.information.typeMaps.examType,
  exam: state.information.filterType.exam || ''
})

export default connect(mapState)(ExamView)
