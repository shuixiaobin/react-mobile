import { connect } from 'dva'
import React, { Component } from 'react'
import inforDetail from './informationDetail.less'
import OpenApp from '@/components/openApp/root'
import Article from './components/article/root'
import AdClassInfo from './components/adClassInfo/root'
import ArticleList from './components/articleList/root'
import CopyRight from '@/components/copyRight/root'
import Sidebar from '@/components/sidebar/root'

class InformationDetail extends Component {
  state = { search: '' }

  componentDidMount() {
    const { location } = this.props

    this.updateStateSearch(location.search)
  }

  shouldComponentUpdate({ location }, { search }) {
    const flag = search !== location.search

    if (flag) this.updateStateSearch(location.search)

    return flag
  }

  componentWillUnmount() {
    const { dispatch } = this.props

    dispatch({
      type: 'informationDetail/CLEAR_INFORMATION_DETAIL'
    })
  }

  // 资讯详情
  getInforMationDetail() {
    const { dispatch } = this.props
    const { search } = this.state
    const { id } = qs.parse(search)

    if (id) {
      dispatch({
        type: 'informationDetail/getInforMationDetail',
        payload: { id }
      })
    }
  }

  // 更新 state search
  updateStateSearch(search) {
    this.setState({ search }, () => this.getInforMationDetail())
  }

  render() {
    return (
      <div id={inforDetail.information_detail}>
        <Article />
        <AdClassInfo />
        <ArticleList />
        <div className={inforDetail.CopyRight}>
          <CopyRight outStyle={{ position: 'static' }} />
        </div>
        <div className={inforDetail.bottom_zw} />
        <OpenApp />
        <Sidebar hasShare />
      </div>
    )
  }
}

const mapState = state => ({
  articleList: state.informationDetail.articleList,
  calendar: state.informationDetail.calendar
})

export default connect(mapState)(InformationDetail)
