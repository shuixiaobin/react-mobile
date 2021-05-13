import { connect } from 'dva'
import React, { Component } from 'react'
import { Tabs } from 'antd-mobile'
import { routerRedux } from 'dva/router'
import tag from './tag.less'
import { getTagList } from '@/services/listService'
import OpenApp from '@/components/openApp/root'

class Tag extends Component {
  state = {
    underlineLeft: '12%',
    tabs: [
      {
        title: '最新标签',
        orderType: 1
      },
      {
        title: '热门标签',
        orderType: 2
      },
      {
        title: '随机标签',
        orderType: 3
      }
    ],
    list: []
  }

  componentDidMount() {
    // init
    this.getTagList(this.state.tabs[0].orderType)
  }

  changeSearchType = ({ orderType }, index) => {
    this.setState({ underlineLeft: `${index * 33.5 + 12}%` }, async () => {
      this.getTagList(orderType)
    })
  }

  /**
   * 资讯详情
   */
  toMationDetail = ({ id, title }) => () => {
    const { dispatch } = this.props

    dispatch(
      routerRedux.push({
        pathname: '/other/informationList',
        search: qs.stringify({
          id,
          title
        })
      })
    )
  }

  getTagList = async orderType => {
    const data = await getTagList({ orderType })

    this.setState({ list: [...data] })
  }

  render() {
    const { tabs, underlineLeft, list } = this.state

    return (
      <div id={`${tag.tagWrap}`} className="f32">
        <div className={`${tag.header}`}>
          <Tabs
            tabBarUnderlineStyle={{
              left: underlineLeft
            }}
            swipeable={false}
            tabs={tabs}
            onChange={this.changeSearchType}
          >
            {/* {children} */}
          </Tabs>
        </div>
        <ul className={tag.main}>
          {list.map(t => (
            <li
              key={t.id}
              onClick={this.toMationDetail({
                id: t.id,
                title: t.tag
              })}
            >
              {t.tag}
            </li>
          ))}
        </ul>

        <div className={tag.zw} />
        <OpenApp />
      </div>
    )
  }
}

export default connect()(Tag)
