import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import inforBulletin from '../information.less'

class BulletinView extends Component {
  state = {}

  choose = e => {
    const li = closest(e.target, 'li') || ''
    const { dispatch, viewClose } = this.props

    if (li) {
      const { k, v } = li.dataset

      dispatch({
        type: 'information/setFilterType',
        payload: {
          key: 'bulletin',
          k,
          v
        }
      }).then(() => viewClose())
    }
  }

  render() {
    const { bulletinType, ispull, bulletin } = this.props

    return ispull ? (
      <div
        style={{
          maxHeight: document.documentElement.clientHeight
        }}
        className={`${inforBulletin.examView}`}
        onClick={this.choose}
      >
        {bulletinType ? (
          <ul className={`${inforBulletin.type_list} oh f28`}>
            {bulletinType.map(item => (
              <li
                className={`${bulletin.v === item.v ? 'choose_li' : ''} fl`}
                key={item.k}
                data-k={item.k}
                data-v={item.v}
              >
                {item.v}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    ) : null
  }
}

const mapState = state => ({
  bulletinType: state.information.typeMaps.bulletinType,
  bulletin: state.information.filterType.bulletin || ''
})

export default connect(mapState)(BulletinView)
