/**
 * 合集，课程列表
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import GiftList from '../giftList/root'
import detail from '../../detail.less'
import ActivityModel from '../activity/root'

class OrderClass extends Component {
  state = {}

  render() {
    const {
      list,
      protocolUrl,
      isSigned,
      goSign,
      order: { payStatus },
      showSignedButton,
      isNewAgreement,
      protocolH5Url
    } = this.props

    return list.length == 0 ? null : (
      <div>
        {list.map(listitem => (
          <div key={listitem.title}>
            <div className={`${detail.orderClass}`}>
              {/* <div className="fl"> */}
              <div>
                <p className={`${detail.title} f28`}>{listitem.title}</p>
                <p
                  className={`${detail.brief} f28`}
                  dangerouslySetInnerHTML={{ __html: listitem.brief }}
                />
                <ul className="oh">
                  {listitem.teacherInfo.map(item => (
                    <li className="fl" key={item.teacherId}>
                      <img src={item.roundPhoto} alt="" />
                      <span className="f24">{item.teacherName}</span>
                    </li>
                  ))}
                </ul>

                <p className={`${detail.lessonCount} f20`}>
                  {listitem.lessonCount}课时
                </p>
              </div>
              {/* <div className="fr"> */}
              {/* 价格 */}
              {/* <p className={`${detail.finalPrice} f28`}>
                  <span className="f20">¥</span>
                  {listitem.finalPrice}
                </p> */}
              {/* {listitem.price !== listitem.finalPrice ? (
                  <p className={`${detail.price} f28`}>
                    <del>{`¥${listitem.price}`}</del>
                  </p>
                ) : null} */}
              {/* 课时 */}
              {/* <p className={`${detail.lessonCount} f20`}>
                  {listitem.lessonCount}课时
                </p> */}
              {/* </div> */}
            </div>
            {/* 协议 */}
            {isSigned == 2 ? (
              <div className={detail.watchsign}>
                <a>
                  {
                    // eslint-disable-next-line react/button-has-type
                    <button
                      onClick={() => {
                        window.location.href = protocolUrl
                      }}
                    >
                      查看协议
                    </button>
                  }
                </a>
              </div>
            ) : null}

            {isSigned == 1 ? (
              <div className={detail.tosign}>
                <a>
                  {
                    // eslint-disable-next-line react/button-has-type
                    <button onClick={() => {goSign()}}>
                      签订协议
                    </button>
                  }
                </a>
              </div>
            ) : null}

            {
              isNewAgreement == 0 ? '' : !protocolH5Url ? (
                <div className={detail.tosign}>
                <a>
                  {
                    // eslint-disable-next-line react/button-has-type
                    <button onClick={() => {goSign()}}>
                      签订协议
                    </button>
                  }
                </a>
              </div>
              ) : (
                <div className={detail.watchsign}>
                  <a>
                    {
                      // eslint-disable-next-line react/button-has-type
                      <button
                        onClick={() => {
                          window.location.href = protocolH5Url
                        }}
                      >
                        查看协议
                      </button>
                    }
                  </a>
                </div>
            )}
          
            {/* 申论批改，图书赠送 */}
            <GiftList classItem={listitem} />
            {/* 活动弹层 */}
            {payStatus === 0 ? <ActivityModel classId={listitem.rid} /> : null}
          </div>
        ))}
      </div>
    )
  }
}

export default connect()(OrderClass)
