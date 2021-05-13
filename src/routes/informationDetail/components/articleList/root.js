import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import inforDetail from '../../informationDetail.less'

class ArticleList extends Component {
  state = {}

  /**
   * 资讯详情
   */
  toMationDetail = ({ id }) => () => {
    const { dispatch } = this.props

    dispatch(
      routerRedux.push({
        pathname: '/other/informationDetail',
        search: qs.stringify({
          id
        })
      })
    )
  }

  render() {
    const { myUrl, articleList = [] } = this.props

    return JSON.stringify(articleList) !== '[]' ? (
      <div className={inforDetail.articleList}>
        <p className={`${inforDetail.infor_tabs} f40`}>
          <img src={`${myUrl}tjzx.png`} alt="" /> 相关资讯推荐
        </p>
        <ul>
          {articleList.map(article => (
            <li
              className="oh"
              key={article.id}
              onClick={this.toMationDetail(article)}
            >
              <p className="fl f34">{article.title}</p>
              <p className="fr f28">{article.createTime}</p>
            </li>
          ))}
        </ul>
      </div>
    ) : null
  }
}
const mapState = state => ({
  myUrl: state.all.myUrl,
  articleList: state.informationDetail.articleList
})

export default connect(mapState)(ArticleList)
