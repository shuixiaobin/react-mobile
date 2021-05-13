import { connect } from 'dva'
import React, { Component } from 'react'
import { Tabs, WhiteSpace, Toast } from 'antd-mobile'
import noteEssence from '../../noteEssence.less'
import { getNoteCateList } from '@/services/javaApi'
import barUtil from '@/utils/barUtil'

class Bar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      underlineLeft: '4%',
      barClass: '',
      barList: []
    }
  }

  async componentDidMount() {
    const { location } = this.props

    try {
      const data = await getNoteCateList()
      const copyData =
        location.pathname === '/search'
          ? data.filter(cate => cate.name !== '热门')
          : data

      this.setState({
        barList: copyData.map(item => ({
          ...item,
          title: item.name
        }))
      })

      // 兼容搜索去除热门
      let initUnderlineLeft = '7.5%'
      if (copyData[0].name.length <= 2) initUnderlineLeft = '4%'
      this.setState(
        {
          underlineLeft: initUnderlineLeft
        },
        () => {
          // init tabar
          this.setNoteType(copyData[0])
        }
      )
    } catch (e) {
      Toast.fail(e)
    }

    document.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    // 滚动条高度
    const { scrollTop } = document.documentElement // 滚动条滚动高度

    this.setState({
      barClass: scrollTop >= 193 ? 'set-top' : ''
    })
  }

  setNoteType = ({ type }, index) => {
    const { dispatch } = this.props

    this.setState(
      { underlineLeft: `${barUtil.setUnderlineLeft(index) * 100}%` }, // 设置偏移距离
      () => {
        dispatch({
          type: 'noteEssence/setNoteType',
          payload: { type }
        })
      }
    )
  }

  render() {
    const { barClass, barList, underlineLeft } = this.state
    const { children } = this.props

    return (
      <div id="level_s-tab-bar">
        <div data-bar>
          <div className={`${noteEssence.zw} ${barClass ? 'db' : 'dn'}`} />
          <div id="ht-tabs">
            <div
              id={noteEssence.barWrap}
              className={barClass ? noteEssence[barClass] : null}
            >
              <Tabs
                tabBarUnderlineStyle={{
                  left: underlineLeft
                }}
                tabs={barList}
                swipeable={false}
                onChange={this.setNoteType}
              >
                {children}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Bar)
