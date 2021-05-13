import React, { Component } from 'react'
import { connect } from 'dva'
import Activity from './Activity'

import detail from '../classDetail.less'

class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: true,
      iconArr: {
        总课时数: 'iconkebiaox1',
        课程时间: 'iconkebiaox1',
        '活动时间：': 'iconbianzu2',
        名师团队: 'iconkebiaox4',
        学习资料: 'iconxuexi-x',
        课程有效期: 'iconkebiaox3',
        不支持: 'iconVIPx',
        增值服务: 'iconfuwux'
      }
    }
  }

  handlePull = () => {
    const { isHidden } = this.state
    this.setState({
      isHidden: !isHidden
    })
  }

  render() {
    const { isHidden, iconArr } = this.state
    const { classDetail, classExt } = this.props
    return (
      <div className={detail.detail}>
        <div className={detail.p30}>
          <h3 className={detail.title}>{classDetail.classTitle}</h3>
          <p className={`${detail.desc} mt20`}>
            {classDetail.courseIntroduction}
          </p>
          <div className={`${detail.buyWrapper} mt30`}>
            <div className={detail.priceWrapper}>
              {classDetail.actualPrice != 0 ? (
                <span className={detail.price}>
                  <i className={`${detail.icon} mr10`}>¥</i>
                  {classDetail.actualPrice}
                </span>
              ) : (
                <span className={`${detail.price} ${detail.green}`}>免费</span>
              )}
              {classDetail.actualPrice !== classDetail.price ? (
                <span className={`${detail.actualPrice} ml20`}>
                  ¥{classDetail.price}
                </span>
              ) : (
                ''
              )}
            </div>
            {classDetail.buyNum > 0 ? (
              <span className={detail.buyCount}>
                {classDetail.buyNum}人
                {classDetail.actualPrice == 0 ? '报名' : '购买'}
              </span>
            ) : null}
          </div>
        </div>
        <Activity hasM />
        <div className={detail.p30}>
          <ul
            className={`${detail.listCon} ${
              isHidden === true &&
              classDetail.columnHeaders &&
              classDetail.columnHeaders.length > 3
                ? detail.oh
                : ''
            }`}
            style={{
              borderBottom:
                classDetail.columnHeaders &&
                classDetail.columnHeaders.length <= 3
                  ? '1px solid #E1E1E1'
                  : ''
            }}
          >
            {classDetail.columnHeaders &&
              classDetail.columnHeaders.map((item, index) => (
                <li className={detail.item} key={item}>
                  <i
                    className={`${detail.icon} iconfont ${iconArr[item]} mr20`}
                  />
                  <b className={detail.blodWord}>{item}</b>
                  <span className={detail.content}>
                    {classDetail.columnDetails[index]}
                  </span>
                </li>
              ))}
          </ul>
          {classDetail.columnHeaders && classDetail.columnHeaders.length > 3 ? (
            <div className={detail.pull} onClick={this.handlePull}>
              <i
                className={`iconfont ${
                  isHidden === true ? 'iconxiala2' : 'iconshanglabeifen'
                }`}
              />
            </div>
          ) : null}
          <div
            className={detail.htmlText}
            dangerouslySetInnerHTML={{ __html: classExt }}
          />
        </div>
      </div>
    )
  }
}
const mapState = state => ({
  classDetail: state.classDetail.classDetail,
  classExt: state.classDetail.classExt
})
export default connect(mapState)(Detail)
