import React, { Component } from 'react'
import { connect } from 'dva'
import afterStyle from '../afterClass.less'

class Filter extends Component {
  selectHandle(title, type, index) {
    const { dispatch } = this.props
    dispatch({
      type: 'afterClass/setTitle',
      payload: {
        title,
        type,
        current: index
      }
    })
  }

  render() {
    const { current, filterType } = this.props
    return (
      <div className={afterStyle.filters}>
        {Object.keys(filterType).map((key, index) => (
          <div
            key={filterType[key].title}
            onClick={this.selectHandle.bind(
              this,
              filterType[key].title,
              key,
              index
            )}
            className={afterStyle.filterItem}
          >
            <span className="ellipsis">{filterType[key].title}</span>
            <i
              className={`iconfont iconxiala2 ${
                index === current ? afterStyle.down : afterStyle.up
              }`}
            />
          </div>
        ))}
      </div>
    )
  }
}

const mapState = state => ({
  current: state.afterClass.current,
  filterType: state.afterClass.filterType
})

export default connect(mapState)(Filter)
