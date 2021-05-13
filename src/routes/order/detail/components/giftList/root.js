import React from 'react'
import { connect } from 'dva'
import detail from '../../detail.less'

class GiftList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { classItem, myUrl } = this.props
    const { exposition = [], entity, classSubMarkInfo } = classItem

    return (
      <div>
        {exposition && exposition.length > 0 ? (
          <div className={`${detail.GiftList} f24`}>
            <p className={`${detail.gift_title} f28`}>
              申论批改服务
              <img src={`${myUrl}order-zp.png`} alt="" />
            </p>
            {exposition.map(exp => (
              <p className={detail.gift_content} key={exp.title}>
                {exp.title} X {exp.count}
                {/* 有效期 */}
                <span className="fr">{exp.expireDate}</span>
              </p>
            ))}
          </div>
        ) : null}
        {
          classSubMarkInfo && classSubMarkInfo.effectiveDate ? (
            <div className={`${detail.GiftList} f24`}>
              <p className={`${detail.gift_title} f28`}>
                主观题批改
                {
                  classSubMarkInfo.isPresent ? (
                    <img src={`${myUrl}order-zp.png`} alt="" />
                  ) : null
                }
              </p>
              <p className={detail.gift_content}>
                共{classSubMarkInfo.subjectiveNum}次
                {/* 有效期 */}
                <span className="fr">{classSubMarkInfo.effectiveDate}</span>
              </p>
            </div>
          ) : null
        }
        {entity ? (
          <div className={`${detail.GiftList} f24`}>
            <p className={`${detail.gift_title} f28`}>
              图书赠送
              <img src={`${myUrl}order-zp.png`} alt="" />
            </p>
            <p className={detail.gift_content}>{entity}</p>
          </div>
        ) : null}
      </div>
    )
  }
}

const mapState = state => ({
  myUrl: state.all.myUrl
})

export default connect(mapState)(GiftList)
