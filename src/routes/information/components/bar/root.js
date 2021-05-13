import { connect } from 'dva'
import React, { Component } from 'react'
import inforBar from '../information.less'
import AreaView from '../areaView/root'
import ExamView from '../examView/root'
import BulltionView from '../bulletinView/root'

class MationBar extends Component {
  state = {
    // eslint-disable-next-line react/no-unused-state
    barStyles: {},
    currentBar: '',
    barMaps: [
      {
        name: '选择考试',
        type: 'exam',
        ispull: false,
        Component: ExamView
      },
      {
        name: '选择地区',
        type: 'area',
        ispull: false,
        Component: AreaView
      },
      {
        name: '选择分类',
        type: 'bulletin',
        ispull: false,
        Component: BulltionView
      }
    ]
  }

  componentDidMount() {
    this.setState({
      barStyles: this.setBarStyles()
    })

    disableScroll(document.getElementById('barMapsScroll'))
  }

  componentWillUnmount() {
    unDisableScroll(document.getElementById('barMapsScroll'))
  }

  pullorup = e => {
    const li = closest(e.target, 'li') || ''
    const { barMaps, currentBar } = this.state

    if (li) {
      const { name = '' } = li.dataset

      this.setState({
        // eslint-disable-next-line react/no-unused-state
        currentBar: currentBar === name ? '' : name,
        barMaps: [
          ...barMaps.map(bar => {
            // eslint-disable-next-line no-unused-expressions
            bar.name === name
              ? (bar.ispull = !bar.ispull)
              : (bar.ispull = false)
            return bar
          })
        ]
      })
    }
  }

  viewClose = () => {
    const { barMaps } = this.state

    this.setState({
      // eslint-disable-next-line react/no-unused-state
      currentBar: '',
      barMaps: [...barMaps.map(bar => ({ ...bar, ispull: false }))]
    })
  }

  setBarStyles = () => {
    const { location } = this.props
    const { pathname } = location
    const headerHeight = document.querySelectorAll('div[data-header]')[0]
      .offsetHeight
    const barHeight = document.getElementById('infor_bar')
      ? document.getElementById('infor_bar').offsetHeight
      : 0

    const defaultHeight =
      document.documentElement.clientHeight - headerHeight - barHeight
    switch (pathname) {
      case '/search':
        // eslint-disable-next-line no-case-declarations
        const searchBarHeight = document.querySelectorAll(
          'div[data-searchbar]'
        )[0].offsetHeight

        return {
          Position: inforBar.searchPosition,
          maxHeight: defaultHeight - searchBarHeight
        }
      default:
        return {
          Position: inforBar.inforPosition,
          maxHeight: defaultHeight
        }
    }
  }

  render() {
    const { barMaps, currentBar } = this.state
    const { filterType } = this.props
    const { barStyles } = this.state

    return (
      <>
        <div className={inforBar.zw} />
        <div data-bar id={inforBar.inforBar}>
          {/* bar */}
          <ul className="f32 oh" id="infor_bar" onClick={this.pullorup}>
            {barMaps.map(bar => (
              <li
                data-name={bar.name}
                style={{ fontWeight: currentBar === bar.name ? 600 : 400 }}
                className="fl"
                key={bar.name}
              >
                <span>
                  {filterType[bar.type] ? filterType[bar.type].v : bar.name}
                </span>
                <i
                  className={`${
                    currentBar === bar.name ? inforBar.down : inforBar.up
                  } iconfont iconxiala2 f40`}
                />
              </li>
            ))}
          </ul>
          {/* 筛选列表 */}
          <div
            id="barMapsScroll"
            className={`${currentBar ? 'db' : 'dn'} ${inforBar.barBox}`}
            style={{
              maxHeight: barStyles.maxHeight
            }}
          >
            {barMaps.map(Bar => (
              <Bar.Component
                viewClose={this.viewClose}
                key={Bar.name}
                ispull={Bar.ispull}
              />
            ))}
          </div>
        </div>
      </>
    )
  }
}

const mapState = state => ({
  filterType: state.information.filterType
})

export default connect(mapState)(MationBar)
