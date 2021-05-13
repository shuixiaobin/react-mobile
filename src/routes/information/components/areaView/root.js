import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import inforArea from '../information.less'

class AreaView extends Component {
  state = {}

  choose = e => {
    const li = closest(e.target, 'li') || ''
    const { dispatch, viewClose } = this.props

    if (li) {
      const { k, v } = li.dataset

      dispatch({
        type: 'information/setFilterType',
        payload: {
          key: 'area',
          k,
          v
        }
      }).then(() => viewClose())
    }
  }

  render() {
    const { areaList, ispull, area } = this.props

    return ispull ? (
      <div
        style={{
          maxHeight: document.documentElement.clientHeight
        }}
        className={`${inforArea.examView}`}
        onClick={this.choose}
      >
        {areaList
          ? Object.keys(areaList).map(key => (
            <div key={key}>
              <div
                  className={`${inforArea.type_title} ${
                    key === '0' ? 'dn' : 'db'
                  } f28`}
                >
                  {key}
                </div>
              <ul className={`${inforArea.type_list} oh f28`}>
                  {areaList[key].map(item => (
                    <li
                      className={`${area.v === item.v ? 'choose_li' : ''} fl`}
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
  areaList: state.information.typeMaps.areaList,
  area: state.information.filterType.area || ''
})

export default connect(mapState)(AreaView)
