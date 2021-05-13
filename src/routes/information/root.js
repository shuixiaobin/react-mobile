import { connect } from 'dva'
import React, { Component } from 'react'
import MationBar from './components/bar/root'
import MationList from './components/list/root'

class Information extends Component {
  state = {
    isFromTagPage: false
  }

  componentDidMount() {
    const { location } = this.props

    setReferrer('咨询列表页') // 前向来源

    this.setState(
      {
        isFromTagPage: location.search.indexOf("id") > -1 && location.search.indexOf("title") > -1
      },
      () => {
        this.setListOptions()
      }
    )
  }

  setListOptions = () => {
    const {
      dispatch,
      currentRoute,
      location: { pathname }
    } = this.props
    const { isFromTagPage } = this.state
    let height

    switch (pathname) {
      case '/search':
        height = document.documentElement.clientHeight
        break
      case '/other/informationList':
        if (isFromTagPage) {
          height = document.documentElement.clientHeight * 0.94
        } else {
          height = document.documentElement.clientHeight * 0.86
        }
        break
      default:
        break
    }

    if (currentRoute !== '/search') {
      dispatch({
        type: 'listView/SET_LIST_OPTIONS',
        payload: {
          height,
          isWingBlank: true,
          isPullToRefresh: true,
          isUpToRefresh: true
        }
      })
    }
  }

  render() {
    const { isFromTagPage } = this.state
    const {
      location: { search }
    } = this.props

    return (
      <>
        {isFromTagPage ? null : <MationBar {...this.props} />}
        <MationList
          isFromTagPage={isFromTagPage}
          isFromTagPageTitle={qs.parse(search).title || ''} // tagname
        />
      </>
    )
  }
}

export default connect()(Information)
