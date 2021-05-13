/* eslint no-dupe-keys: 0, no-mixed-operators: 0 */
/* 列表刷新组件 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { PullToRefresh, ListView } from 'antd-mobile'
import SearchNomore from '@/routes/search/components/nomore/root'
import { withRouter } from 'dva/router'
import AllNomore from './component/nomore/root'
import List from './ListContainer.less'
import Sidebar from '@/components/sidebar/root'
import NoData from '@/components/noData/root'

class ListContainer extends Component {
  constructor(props) {
    super(props)
    const { myUrl } = this.props
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
    const indicatorKey = ['activate', 'deactivate', 'release', 'finish']

    this.state = {
      dataSource,
      refreshing: true,
      isLoading: true,
      indicator: indicatorKey.reduce(
        (last, item) => ({
          ...last,
          [item]: (
            <div className={`${List.gif} f24 oh`}>
              <p>
                <img src={`${myUrl}pull.gif`} alt="" />
                下拉刷新
              </p>
            </div>
          )
        }),
        {}
      ),
      noMore: (
        <div className={`${List.nomore} f28`}>
          <ul className="oh">
            <li className={List.line} />
            <li className={List.text}>没有更多了</li>
            <li className={List.line} />
          </ul>
        </div>
      )
    }
  }

  componentDidMount() {
    const { triggerRef, isDisableScroll = false } = this.props

    triggerRef(this)

    if (isDisableScroll) {
      disableScroll(document.querySelector('.listViewScroll'))
    } else {
      unDisableScroll(document.querySelector('.listViewScroll'))
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource } = this.state
    this.setState({
      dataSource: dataSource.cloneWithRows(nextProps.list)
    })
  }

  componentWillUnmount() {
    clearBodyScrollLocks()
    this.setState = (state, callback) =>
      unDisableScroll(document.querySelector('.listViewScroll'))
  }

  initList = () => {
    const { dataSource } = this.state
    this.setState({
      dataSource: dataSource.cloneWithRows(this.props.list),
      refreshing: false,
      isLoading: false
    })
  }

  // 滚动到顶部
  listViewScrollEvent = () => {
    const parentEle = document.querySelector('.list-view-section-body')
    let Dis = parentEle.lastElementChild.offsetTop // 最后一个元素距顶部距离

    const scrollToTop = window.setInterval(() => {
      if (Dis > 0) {
        this.lv.scrollTo(0, (Dis -= 50))
      } else {
        window.clearInterval(scrollToTop)
      }
    }, 2)
  }

  // 下拉
  onRefresh = () => {
    const { dataSource } = this.state
    const { isDisableScroll } = this.props
    const view = document.querySelector('.listViewScroll') || ''
    // 重置滚动位置到顶部
    if (view) view.scrollTop = 0

    this.setState({ refreshing: true, isLoading: true })

    this.props.handleRefresh().then(() => {
      this.setState({
        dataSource: dataSource.cloneWithRows(this.props.list)
      })

      if (isDisableScroll) {
        disableScroll(document.querySelector('.listViewScroll'))
      }

      setTimeout(() => {
        this.setState({
          refreshing: false,
          isLoading: false
        })
      }, 800)
    })
  }

  // 上拉
  onEndReached = () => {
    const { hasMore } = this.props
    const { dataSource, isLoading } = this.state
    if (isLoading) {
      return
    }

    if (hasMore) {
      this.setState({ isLoading: true })

      this.props.handleEndReached().then(() => {
        this.setState({
          dataSource: dataSource.cloneWithRows(this.props.list),
          isLoading: false
        })
      })
    }
  }

  render() {
    const {
      children,
      isUpToRefresh,
      isPullToRefresh,
      pageSize,
      height,
      hasMore,
      isNomore,
      currentRoute,
      isShowSidebar = true,
      hasShare = false
    } = this.props
    const { dataSource, isLoading, refreshing, indicator, noMore } = this.state

    // 当前 item
    const row = (rowData, sectionID, rowID) => {
      const childrenWithProps = React.Children.map(children, child =>
        React.cloneElement(child, { row: rowData })
      )

      return (
        // eslint-disable-next-line no-plusplus
        <div key={rowID} id={`${sectionID}_view-${++rowID}`}>
          {childrenWithProps}
        </div>
      )
    }

    // 没有更多数据
    const lastRender = () => (isUpToRefresh ? noMore : null)

    // 无数据
    const NomoreRender = () => {
      const styles = { height: document.documentElement.clientHeight }
      const noMoreMaps = {
        '/search': <SearchNomore defaultStyle={styles} />,
        '/all': <AllNomore defaultStyle={styles} />,
        '/class/classDetail': (
          <NoData
            desc="暂无课程评价"
            setHeight={document.documentElement.clientHeight * 0.5}
          />
        )
      }

      return noMoreMaps[currentRoute]
    }

    return isNomore ? (
      <NomoreRender />
    ) : (
      <div id="listView">
        <ListView
          className={`${List.listView} listViewScroll`}
          ref={el => (this.lv = el)}
          dataSource={dataSource}
          renderFooter={
            isUpToRefresh
              ? () => (
                  <div className={List.renderFooter}>
                    {isLoading || hasMore ? '正在加载...' : lastRender()}
                  </div>
                )
              : null
          }
          renderRow={row}
          style={{
            height
          }}
          pullToRefresh={
            isPullToRefresh ? (
              <PullToRefresh
                indicator={indicator}
                refreshing={refreshing}
                onRefresh={this.onRefresh}
              />
            ) : null
          }
          onEndReached={isUpToRefresh ? this.onEndReached : null}
          pageSize={pageSize}
          onEndReachedThreshold={10}
        />
        {isShowSidebar ? (
          <Sidebar
            listViewScrollEvent={this.listViewScrollEvent}
            listViewEl={() => document.querySelector('.listViewScroll')}
            hasShare={hasShare}
            {...this.props}
          />
        ) : null}
      </div>
    )
  }
}

const mapState = state => ({
  myUrl: state.all.myUrl,
  list: state.listView.list,
  pageSize: state.listView.pageSize,
  isUpToRefresh: state.listView.isUpToRefresh,
  isPullToRefresh: state.listView.isPullToRefresh,
  isWingBlank: state.listView.isWingBlank,
  hasMore: state.listView.hasMore,
  height: `${state.listView.height}px`,
  isNomore: state.listView.isNomore,
  currentRoute: state.listView.currentRoute,
  scrollDis: state.listView.height
})

export default withRouter(connect(mapState)(ListContainer))
