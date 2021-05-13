import { connect } from 'dva'
import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import noteEssenceDetail from './noteEssenceDetail.less'
import { getNoteEssenceDetail } from '@/services/noteEssenceService'
import OpenApp from '@/components/openApp/root'
import Sidebar from '@/components/sidebar/root'
import { NewsDetailView } from '@/utils/setSensors'

class NoteEssenceDetail extends Component {
  // eslint-disable-next-line react/no-unused-state
  state = { noteDetail: {} }

  async componentDidMount() {
    const { location } = this.props
    const { id } = qs.parse(location.search)

    try {
      const data = await getNoteEssenceDetail({
        id
        // id: 189633
      })

      this.setState(
        {
          noteDetail: data
        },
        () => {
          document.title = data.title
          this.NewsDetailViewTrack(data)
        }
      )
    } catch (e) {
      Toast.fail(e)
    }
  }

  /**
   * 详情埋点
   */
  NewsDetailViewTrack = r => {
    const { title, id, clickSum, articleArea, articleType, articleTest } = r
    const referrer = getReferrer()

    NewsDetailView({
      page_source: referrer, // 前向来源
      view_number: clickSum,
      article_title: title,
      article_kind: '备考精华',
      article_id: id,
      article_area: articleArea,
      marticle_type: articleType,
      marticle_test: articleTest
    })
  }

  render() {
    const { noteDetail } = this.state
    const { location } = this.props
    const { id } = qs.parse(location.search)

    return (
      <div id={noteEssenceDetail.noteEssenceDetailWrap}>
        {noteDetail ? (
          <div className={noteEssenceDetail.article}>
            <div className={noteEssenceDetail.article_title}>
              <p className="f48">{noteDetail.title}</p>
              <p className="oh f28">
                <span className="fl">{noteDetail.addTime}</span>
                <span className="fr">{noteDetail.clickSum}人查看</span>
              </p>
            </div>
            <div
              className={`${noteEssenceDetail.article_body}  f36 oh`}
              dangerouslySetInnerHTML={{ __html: noteDetail.archivesBody }}
            />
          </div>
        ) : null}
        <div className={noteEssenceDetail.bottom_zw} />
        <OpenApp params={{ type: 7, id }} />
        <Sidebar hasShare />
      </div>
    )
  }
}

export default connect()(NoteEssenceDetail)
