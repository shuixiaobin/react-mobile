import React from 'react'
import { connect } from 'dva'
import detail from '../classDetail.less'

function Star(props) {
  const { myUrl, starNum, score } = props
  const starArrs = []
  // eslint-disable-next-line
  for (let index = 0; index < starNum; index++) {
    starArrs.push(
      <img src={`${myUrl}Star.png`} key={index} className="fl" alt="" />
    )
  }
  return (
    <div className={detail.rateWrapper}>
      <div className={`${detail.starWrapper} oh`}>{starArrs}</div>
      <span className={`${detail.num} ml10 ${score ? 'db' : 'dn'}`}>{score}分</span>
    </div>
  )
}

const mapState = state => ({
  myUrl: state.all.myUrl
})

export default connect(mapState)(Star)
