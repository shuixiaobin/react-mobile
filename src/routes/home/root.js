import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import home from './home.less'
import { getQueryStr, setReferrer } from '@/utils/global'
import CarouselSlide from './components/carousel/root' // 轮播
import Bar from './components/bar/root'
import OpenApp from '@/components/openApp/root'
import ClassListItem from '@/components/classList/classListItem/root' // 课程列表 item
import Sidebar from '@/components/sidebar/root'
import { getClassList } from '@/services/listService'
import { CilckButton } from '@/utils/setSensors'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  // eslint-disable-next-line react/sort-comp
  componentWillReceiveProps(nextProps) {
    this.getCateKeyFromModel({ isDidMount: false, nextProps })
  }

  componentDidMount() {
    // 储存前向来源
    setReferrer('首页')
    const { dispatch } = this.props
    this.setListOptions()
    if (getQueryStr('redirect')) {
      dispatch({ type: 'all/showLogin' })
    }

    this.getCateKeyFromModel({ isDidMount: true })
  }

  toOtherRouter = e => {
    const { path } = closest(e.target, 'img').dataset
    const { dispatch } = this.props
    // 神策按钮埋点
    switch (path) {
      case '/other/noteEssence':
        CilckButton({
          on_page: '首页',
          first_module: '首页',
          button_name: '备考精华'
        })
        dispatch(
          routerRedux.push({
            pathname: path
          })
        )
        break
      case '/other/informationList':
        CilckButton({
          on_page: '首页',
          first_module: '首页',
          button_name: '热门咨询'
        })
        dispatch(
          routerRedux.push({
            pathname: path
          })
        )
        break
      case '/mk/':
        CilckButton({
          on_page: '首页',
          first_module: '首页',
          button_name: '模考大赛'
        })
        window.location.href = path
        break
      default:
        break
    }
  }

  setListOptions = () => {
    const { dispatch } = this.props
    return dispatch({
      type: 'listView/setListOptions',
      payload: {
        isWingBlank: true,
        isPullToRefresh: false,
        isUpToRefresh: false
      }
    })
  }

  /**
   * 记忆 cateKey
   */
  getCateKeyFromModel = ({ isDidMount = false, nextProps = '' }) => {
    const {
      pageInfos, // 离开前选择的类型
      location: { pathname }
    } = this.props
    const pageInfo = pageInfos[pathname] || ''

    if (isDidMount && pageInfo) {
      // init componentDidMount
      this.getFetchClassList(pageInfo.cateKey)
    } else if (nextProps) {
      // props 更新
      const nextPageInfo = nextProps.pageInfos[pathname] || ''
      if (nextPageInfo && nextPageInfo.cateKey !== pageInfo.cateKey) {
        this.getFetchClassList(nextPageInfo.cateKey)
      }
    }
  }

  // 首页请求课程列表，搜索不请求
  getFetchClassList = cateKey => {
    const { dispatch } = this.props

    dispatch({ type: 'listView/resetList' }).then(() =>
      dispatch({
        type: 'listView/fetchList',
        payload: {
          api: getClassList,
          params: {
            cateId: cateKey
          }
        }
      })
    )
  }

  render() {
    const { myUrl, list } = this.props

    return (
      <div id={home.homePage}>
        <CarouselSlide />
        <div className={`${home.rmbk} container`} onClick={this.toOtherRouter}>
          <img data-path="/mk/" src={`${myUrl}mkds.png`} alt="模考大赛" />
          <img
            data-path="/other/informationList"
            src={`${myUrl}rmzx_02.png`}
            alt="热门资讯"
          />
          <img
            data-path="/other/noteEssence"
            src={`${myUrl}bkjh_02.png`}
            alt="备考精华"
          />
        </div>
        <Bar {...this.props} />
        <div
          id="home_class-list"
          style={{ minHeight: document.documentElement.clientHeight }}
        >
          {list
            ? list.map(r => (
              <ClassListItem row={r} key={r.typeId} {...this.props} />
              ))
            : null}
        </div>
        <div className={home.bottom_zw} />
        <OpenApp />
        <Sidebar hasShare hasRefer />
      </div>
    )
  }
}

const mapState = state => ({
  myUrl: state.all.myUrl,
  list: state.listView.list,
  pageInfos: state.all.pageInfos
})

export default connect(mapState)(Home)
