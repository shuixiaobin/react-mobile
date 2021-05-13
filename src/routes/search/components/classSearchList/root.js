import { connect } from 'dva'
import React, { Component } from 'react'
import { withRouter } from 'dva/router'
import ClassListBar from '@/routes/home/components/bar/root'
import ClassList from '@/components/classList/root'
import { searchClassList } from '@/services/listService'

class ClassSearchList extends Component {
  state = {}

  render() {
    const {
      pageInfos,
      keyWord,
      location: { pathname }
    } = this.props
    const pageInfo = pageInfos[pathname] || ''

    // pageInfo.cateKey 不可为空，列表重复请求
    return (
      <div>
        <ClassListBar {...this.props} fromSearch />
        {pageInfo ? (
          <ClassList
            {...this.props}
            fetchListApi={searchClassList}
            fetchListParams={
              keyWord
                ? { cateId: pageInfo.cateKey, keyWord }
                : { cateId: pageInfo.cateKey }
            }
          />
        ) : null}
      </div>
    )
  }
}

const mapState = state => ({
  pageInfos: state.all.pageInfos,
  keyWord: state.all.keyWord
})

export default withRouter(connect(mapState)(ClassSearchList))
