/**
 * 合集，课程列表
 */
import React from 'react'
import Lazyload from '@/components/lazyload/root'
import noteEssence from '../../../noteEssence.less'

/**
 * noteList item 组件
 * @param {object} row 当前数据
 */
function NoteListItem({ row, ...props }) {
  const { toNoteDetail } = props

  return (
    <div
      onClick={toNoteDetail(row)}
      key={row.id}
      className={`${noteEssence.note_item} oh`}
    >
      <div className="fl">
        <p className={`${noteEssence.note_title} oh f32`}>
          {row.title.substr(0, 25)}
          {row.title.length > 25 ? <span>...</span> : null}
        </p>
        <p className={`${noteEssence.note_bottom} f24 oh`}>
          <span className="fl">{row.typeName}</span>
          <span className="fr">{row.click}人查看</span>
        </p>
      </div>
      <div className="fr">
        <Lazyload lazy={row.img} />
        {/* <img src={row.img} alt="" /> */}
      </div>
    </div>
  )
}

export default NoteListItem
