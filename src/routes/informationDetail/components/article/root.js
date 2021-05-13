import { connect } from 'dva'
import React, { Component } from 'react'
import { withRouter } from 'dva/router'
import inforDetail from '../../informationDetail.less'
import Calendar from '../calendar/root'
import { NewsDetailView } from '@/utils/setSensors'

class Article extends Component {
  state = { showArchivesBody: false }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.article) {
      this.NewsDetailViewTrack(nextProps.article)

      // 收回文章
      this.setState({
        showArchivesBody: false
      })
    }
  }

  isShowArchivesBody = () => {
    const { showArchivesBody } = this.state

    this.setState({
      showArchivesBody: !showArchivesBody
    })
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
      article_kind: '热门咨询',
      article_id: id,
      article_area: articleArea,
      marticle_type: articleType,
      marticle_test: articleTest
    })
  }

  render() {
    const { article } = this.props
    const { showArchivesBody } = this.state

    return (
      <>
        {article ? (
          <div className={inforDetail.article}>
            <div className={inforDetail.article_title}>
              <p className="f48">{article.title}</p>
              <p className="oh f28">
                <span className="fl">{article.addTime}</span>
                <span className="fr">{article.clickSum}人查看</span>
              </p>
            </div>
            <Calendar />
            <div
              className={`${inforDetail.article_body} ${
                showArchivesBody ? '' : inforDetail.up_body
              } f36 oh`}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: article.archivesBody }}
            />
          </div>
        ) : null}
        <div
          onClick={this.isShowArchivesBody}
          className={`${inforDetail.show_body} f28`}
        >
          <div className={showArchivesBody ? '' : inforDetail.boxshow} />
          {showArchivesBody ? null : <span>显示全文</span>}
          <i
            className={`${
              showArchivesBody ? inforDetail.down : inforDetail.up
            } iconfont iconxiala2 f40`}
          />
        </div>
      </>
    )
  }
}

const mapState = state => ({
  article: state.informationDetail.article
})

export default withRouter(connect(mapState)(Article))
