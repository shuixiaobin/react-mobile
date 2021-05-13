import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import inforDetail from '../../informationDetail.less'
import ClassListItem from '@/components/classList/classListItem/root'

class AdClassInfo extends Component {
  state = {}

  /**
   * 跳转合集列表，课程详情
   */
  toCollectOrDetail = r => () => {
    const { collectId, title, classId, collageActiveId } = r
    const { dispatch } = this.props
    const route = collectId
      ? {
          pathname: '/other/collectList',
          search: qs.stringify({
            collectId,
            title: encodeURI(title),
            fetchListApi: 'getCollectList'
          })
        }
      : {
          pathname: '/class/classDetail',
          search: qs.stringify({ collageActiveId, classId })
        }

    dispatch(routerRedux.push({ ...route }))
  }

  render() {
    const { myUrl, adClassInfo = [] } = this.props

    return JSON.stringify(adClassInfo) !== '[]' ? (
      <div className={inforDetail.adClassInfo}>
        <p className={`${inforDetail.infor_tabs} f40`}>
          <img src={`${myUrl}tjkc.png`} alt="" /> 您可能感兴趣的课程
        </p>
        {adClassInfo.map(info => (
          <ClassListItem
            myUrl={myUrl}
            row={info}
            key={info.id}
            toCollectOrDetail={this.toCollectOrDetail}
          />
        ))}
      </div>
    ) : null
  }
}

const mapState = state => ({
  myUrl: state.all.myUrl,
  adClassInfo: state.informationDetail.adClassInfo
})

export default connect(mapState)(AdClassInfo)
