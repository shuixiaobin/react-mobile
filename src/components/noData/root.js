import React from 'react'
import { connect } from 'dva'
import style from './noData.less'

function noData(props) {
  const { desc, url, setHeight } = props
  return (
    <div
      className={style.noData}
      style={{
        height: setHeight || document.documentElement.clientHeight * 0.85
      }}
    >
      <img src={`${url}noData.png`} alt="" />
      <p className={style.desc}>{desc}</p>
    </div>
  )
}

const mapState = state => ({
  url: state.all.myUrl
})

export default connect(mapState)(noData)
