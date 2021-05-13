import { connect } from 'dva'
import React, { Component } from 'react'
import { Tabs, WhiteSpace, Toast } from 'antd-mobile'
import Information from '@/routes/information/root'
import NoteEssence from '@/routes/noteEssence/root'
import ClassSearchList from './components/classSearchList/root'
import HistorySearch from './components/history/root'
import HotSearch from './components/hot/root'
import search from './search.less'
import { getOtherSearch } from '@/services/javaApi'
import { setReferrer } from '@/utils/global'

class Search extends Component {
  state = {
    underlineLeft: '7.5%',
    activeTabIndex: '',
    searchNavs: [
      {
        title: '课程',
        Component: ClassSearchList
      },
      {
        title: '热门资讯',
        Component: Information
      },
      {
        title: '备考精华',
        Component: NoteEssence
      }
    ]
  }

  async componentDidMount() {
    this.activetabDidMount()

    this.setListOptions()

    setReferrer('搜索结果页')

    try {
      const { dispatch } = this.props
      const data = await getOtherSearch()

      dispatch({
        type: 'search/SET_SEARCH_WORDS',
        payload: data
      })
    } catch (e) {
      Toast.fail(e)
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.activeTabIndex !== prevState.activeTabIndex) {
      return {
        activeTabIndex: nextProps.activeTabIndex
      }
    }
    return null
  }

  setListOptions = () => {
    const { dispatch } = this.props

    return dispatch({
      type: 'listView/setListOptions',
      payload: {
        height: document.documentElement.clientHeight * 0.8,
        isWingBlank: true,
        isPullToRefresh: true,
        isUpToRefresh: true
      }
    })
  }

  // init tabar
  activetabDidMount = () => {
    const { activeTabIndex } = this.props
    const activeIndex = activeTabIndex || 0

    this.changeSearchType(this.state.searchNavs[activeIndex], activeIndex)
  }

  // set activeTabIndex
  setActivetabIndex = activetabIndex => {
    const { dispatch } = this.props

    dispatch({
      type: 'search/SET_ACTIVETAB_INDEX',
      payload: {
        activeTabIndex: activetabIndex
      }
    })
  }

  changeSearchType = async (tab, index) => {
    const { dispatch } = this.props

    this.setActivetabIndex(index)

    this.setState({ underlineLeft: `${index * 25 + 7.5}%` }, async () => {
      // 切换分类，重置列表
      await dispatch({
        type: 'listView/routChangeClearList',
        payload: {}
      })

      await dispatch({
        type: 'search/changeSearchType',
        payload: {
          searchType: tab.title
        }
      })
    })
  }

  render() {
    const { searchNavs, underlineLeft, activeTabIndex } = this.state
    const { searchType, keyWord } = this.props

    return (
      <div id={search.searchWrap} data-searchwrap>
        <div id={search.searchBarWrap} data-searchbar="searchBarWrap">
          <WhiteSpace />
          <Tabs
            tabBarUnderlineStyle={{
              left: underlineLeft
            }}
            tabs={searchNavs}
            swipeable={false}
            renderTabBar={props => (
              <Tabs.DefaultTabBar
                {...props}
                activeTab={activeTabIndex}
                onTabClick={this.changeSearchType}
              />
            )}
          />
          <WhiteSpace />
        </div>
        {keyWord ? (
          <div className={search.list} data-title={searchType}>
            {searchNavs.map(Nav =>
              Nav.Component && searchType === Nav.title ? (
                <Nav.Component {...this.props} key={Nav.title} />
              ) : null
            )}
          </div>
        ) : (
          <div>
            <HotSearch />
            <HistorySearch />
          </div>
        )}
      </div>
    )
  }
}

const mapState = state => ({
  searchType: state.search.searchType,
  keyWord: state.all.keyWord,
  list: state.listView.list,
  activeTabIndex: state.search.activeTabIndex
})

export default connect(mapState)(Search)
