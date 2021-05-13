import { connect } from 'dva'
import React, { Component } from 'react'
import noteEssence from './noteEssence.less'
import Bar from './components/bar/root'
import NoteList from './components/list/root'
import OpenApp from '@/components/openApp/root'

class NoteEssence extends Component {
  state = {}

  componentDidMount() {
    setReferrer('咨询列表页') // 前向来源

    this.setListOptions()
  }

  setListOptions = () => {
    const { dispatch, currentRoute } = this.props

    if (currentRoute !== '/search') {
      dispatch({
        type: 'listView/SET_LIST_OPTIONS',
        payload: {
          height: document.documentElement.clientHeight * 0.8,
          isWingBlank: true,
          isPullToRefresh: true,
          isUpToRefresh: true
        }
      })
    }
  }

  render() {
    const { currentRoute } = this.props

    return (
      <div id={noteEssence.noteEssenceWrap}>
        <Bar {...this.props} />
        <NoteList />
        <div className={noteEssence.buttomZw} />
        {currentRoute !== '/search' ? <OpenApp params={{ type: 6 }} /> : null}
      </div>
    )
  }
}

const mapState = state => ({
  currentRoute: state.listView.currentRoute
})

export default connect(mapState)(NoteEssence)
