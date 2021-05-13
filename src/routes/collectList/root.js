import React, { Component } from 'react'
import { connect } from 'dva'
import collect from './collectList.less'
import ClassList from '@/components/classList/root'
import OpenApp from '@/components/openApp/root'
import * as listService from '@/services/listService'
import { getReferrer, getCookie, setCookie, setReferrer } from "@/utils/global";

class CollectList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    // 设置前向来源
    setReferrer('课程列表页')
    const { location } = this.props
    const search = qs.parse(location.search)
    const { title } = search
    this.setListOptions()
    document.title = decodeURI(title) || '合集列表'
    const isInApp = getCookie("isAppUser")
    isInApp? setCookie("cengjingHj",true):setCookie("cengjingHj",false);
  }

  setListOptions = () => {
    const { dispatch, currentRoute } = this.props
    const isInApp = getCookie("isAppUser")
    const clientH = isInApp ? document.documentElement.clientHeight * 0.94 : document.documentElement.clientHeight * 0.83
    if (currentRoute !== '/search') {
      dispatch({
        type: 'listView/SET_LIST_OPTIONS',
        payload: {
          height: clientH,
          isWingBlank: true,
          isPullToRefresh: true,
          isUpToRefresh: true
        }
      })
    }
  }

  render() {
    const { location, loading } = this.props
    const search = qs.parse(location.search)
    const isInApp = getCookie("isAppUser")
    const { fetchListApi, title, ...fetchListParams } = search
    return (
      <div id={collect.collectList}>

 {/*        <ClassList
          {...this.props}
          loading={loading}
          fetchListApi={listService[fetchListApi]}
          fetchListParams={fetchListParams}
          hasShare
          hasRefer
        /> */}

        {!isInApp ? <ClassList
          {...this.props}
          loading={loading}
          fetchListApi={listService[fetchListApi]}
          fetchListParams={fetchListParams}
          hasShare
          hasRefer
        /> :
          <ClassList
            {...this.props}
            loading={loading}
            fetchListApi={listService[fetchListApi]}
            fetchListParams={fetchListParams}
          />
        }

        {
          !isInApp ?
            <OpenApp
              params={{
                type: 16,
                title: decodeURI(title),
                colletionID: fetchListParams.collectId,
              }}
            /> : null
        }

      </div>
    )
  }
}

const mapState = state => ({
  myUrl: state.all.myUrl,
  loading: state.loading.models.listView
})

export default connect(mapState)(CollectList)
