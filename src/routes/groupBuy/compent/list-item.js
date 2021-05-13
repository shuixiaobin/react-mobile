/**
 * 合集，课程列表
 */
import React from 'react'
import { routerRedux, withRouter } from 'dva/router'
import { connect } from 'dva'
import list from '@/components/classList/classListItem/classList.less'
import { listTitle, template } from '@/components/classList/classListItem/render' // classList render

/**
 * classList item 组件
 * @param {object} row 当前数据
 */
function ListItem({ row, ...props }) {
  const {
    myUrl,
    dispatch,
    userName,
    location: { pathname }
  } = props
  const exp = typeof row.data !== 'undefined'


  /**
   * 跳转合集列表，课程详情
   */
  const toCollectOrDetail = r => () => {
    const {
      collectId,
      title,
      classId,
      collageActiveId,
      secondKill,
      isNew,
      defaultId
    } = r

    let route;
    if (collectId) {
      if (isNew) {
        route = {
          pathname: "/class/classDetail",
          search: qs.stringify({ collageActiveId, classId: defaultId, isNew ,collectionId:collectId}),
        };
      } else {
        route = {
          pathname: "/other/collectList",
          search: qs.stringify({
            collectId,
            title: encodeURI(title),
            fetchListApi: "getCollectList",
          }),
        };
      }
    } else if (collageActiveId > 0) {
        route = {
          pathname: "/class/groupClass",
          search: qs.stringify({ collageActiveId, classId }),
        };
      } else {
        route = {
          pathname: "/class/classDetail",
          search: qs.stringify({ collageActiveId, classId }),
        };
      }

    dispatch(routerRedux.push({ ...route }));

      dispatch(routerRedux.push({ ...route }))
  }

  return (
    <div key={row} className={list.classList}>
      {exp ? listTitle(row) : null}
      {exp
        ? row.data.map(r => template(r, toCollectOrDetail))
        : template(row, toCollectOrDetail)}
    </div>
  )
}

const mapState = state => ({
  userName: state.all.userName,
  myUrl: state.all.myUrl,
  keyWord: state.all.keyWord
})

export default withRouter(connect(mapState)(ListItem))
