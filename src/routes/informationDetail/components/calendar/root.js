import { connect } from 'dva'
import React, { Component } from 'react'
import inforDetail from '../../informationDetail.less'

class Calendar extends Component {
  state = {}

  render() {
    const { calendar } = this.props

    return calendar && !Array.isArray(calendar) ? (
      <div className={inforDetail.calendar}>
        <p className="f40">{calendar.department}</p>
        <ul className="f36">
          {Object.keys(calendar.dateTime).map(cal => {
            const { isTag, date } = calendar.dateTime[cal]
            const LiStyle = isTag ? 'focus_li_border' : 'unfocus_li_border'
            const PStyle = isTag ? 'focus_p_border' : 'unfocus_p_border'
            const fontColor = isTag ? 'focus' : 'unfocus'

            return (
              <li className={`${inforDetail[LiStyle]} oh`} key={cal}>
                <p
                  className={`${inforDetail.line} ${
                    inforDetail[fontColor]
                  }  fl`}
                >
                  ——
                </p>
                <p
                  className={`${inforDetail.k} ${inforDetail[fontColor]} ${
                    inforDetail[PStyle]
                  } fl`}
                >
                  {cal}
                </p>
                <p className={`${inforDetail.time} fl`}> {date}</p>
              </li>
            )
          })}
        </ul>
      </div>
    ) : null
  }
}
const mapState = state => ({
  calendar: state.informationDetail.calendar
})

export default connect(mapState)(Calendar)
