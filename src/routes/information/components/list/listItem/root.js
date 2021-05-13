/**
 * 热门资讯列表
 */
import React from 'react'
import inforList from '../../information.less'

/**
 * mationList item 组件
 * @param {object} row 当前数据
 */
function MationListItem({ row, ...props }) {
  const { toMationDetail } = props

  return (
    <div
      onClick={toMationDetail(row)}
      key={row.id}
      className={inforList.mation_item}
    >
      <p className={`${inforList.mation_title} f32`}>{row.title}</p>
      <p className={`${inforList.mation_bottom} f24 oh mt20`}>
        <span className="fl">{row.addtime}</span>
        <span className="fr">{row.click}人查看</span>
      </p>
    </div>
  )
}

export default MationListItem
