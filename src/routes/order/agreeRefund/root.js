import React from 'react'
import { connect } from 'dva'
import { Modal, Toast } from 'antd-mobile'
import agreeRefund from './agreeRefund.less'
import * as order from '@/services/order'

const modalAlert = Modal.alert

class AgreeRefund extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      refundState: 0,//0申请成功，1处理中，2申请通过，3申请未通过/驳回，4退费中，5已退款
      refundReason: ''
    }
  }

  componentDidMount() {
    const { location } = this.props
    const search = qs.parse(location.search)
    this.getRefundState(search.orderId)
  }

  getRefundState = async (orderId) => {
    try {
      const data = await order.getRefundState({order_id:orderId})
      this.setState({
        refundState: data.state == 2 ? 4 : data.state,
        refundReason: data.reason
      })
    } catch (error) {
      Toast.info(error)
    }
  }

  contactService = (userName) => {
    JumpUserCustomer({ robotFlag: 1 }, userName)
  }

  viewReason = () => {
    modalAlert('', this.state.refundReason, [
      { text: '确定', onPress: () => console.log('ok') },
    ])
  }

  render() {
    const { userName } = this.props
    const { refundState, refundReason } = this.state
    const isInApp = () => navigator.userAgent.indexOf("HuaTuOnline") > -1
    return (
      <div id={agreeRefund.refundContainer} style={{ height: isInApp() ? '100vh' : 'calc(100vh - 12vw)' }}>
        <p className={agreeRefund.agreeRefundTip}>以下为退费申请进度，如有疑问请联系售后客服</p>
        <div className={agreeRefund.process}>
          <div className={agreeRefund.processItem}>
            <div className={agreeRefund.processLeft}>
              <div className={`${agreeRefund.line} ${refundState >= 1 ? agreeRefund.lineActive : ''}`}></div>
              <div className={`${agreeRefund.icon} ${refundState >= 0 ? agreeRefund.iconActive : ''}`}><i className={`iconfont iconsq f20`}></i></div>
            </div>
            <div className={agreeRefund.processRight}>
              <p className={`f32  ${refundState >= 0 ? agreeRefund.active : ''}`}>申请成功</p>
            </div>
          </div>
          <div className={agreeRefund.processItem}>
            <div className={agreeRefund.processLeft}>
              <div className={`${agreeRefund.line} ${refundState >= 2 ? agreeRefund.lineActive : ''}`}></div>
              <div className={`${agreeRefund.iconSpan} ${refundState >= 1 ? agreeRefund.iconActive : ''}`}></div>
            </div>
            <div className={agreeRefund.processRight}>
              <p className={`f32 ${refundState >= 1 ? agreeRefund.active : ''}`}>处理中</p>
            </div>
          </div>
          <div className={`${agreeRefund.processItem} ${agreeRefund.processItemNo}`}>
            <div className={agreeRefund.processLeft}>
              <div className={`${agreeRefund.line} ${refundState >= 4 ? agreeRefund.lineActive : ''}`}></div>
              <div className={`${agreeRefund.icon} ${refundState >= 3 ? agreeRefund.iconActive : ''}`}>
                <i className={`iconfont f20 ${refundState > 3 ? 'iconsh' : 'iconwtg'}`}></i>
              </div>
            </div>
            {refundState <= 3 ? refundState <= 1 ? (
              <div className={`${agreeRefund.processRight}`}>
                <p className={`f32 ${refundState >= 3 ? agreeRefund.active : ''}`}>申请审核</p>
              </div>
            ) : (
              <div className={`${agreeRefund.processRight}`}>
                <p className={`f32 ${refundState >= 3 ? agreeRefund.active : ''}`}>审核未通过</p>
                {refundReason.length < 66 ? <div className={agreeRefund.refundReason}>
                  {refundReason}
                </div> : <div className={agreeRefund.refundReason}>
                  {refundReason.slice(0, 60) + '  ...'}
                  <span className={agreeRefund.viewReason} onClick={this.viewReason}>查看</span>
                </div>}
              </div>
            ) : (
              <div className={agreeRefund.processRight}>
                <p className={`f32 ${refundState >= 4 ? agreeRefund.active : ''}`}>审核通过</p>
                <span>华图在线将在尽快打款请您关注帐户变动</span>
              </div>
            )}

          </div>
          <div className={agreeRefund.processItem}>
            <div className={agreeRefund.processLeft}>
              <div className={`${agreeRefund.line} ${refundState >= 5 ? agreeRefund.lineActive : ''}`}></div>
              <div className={`${agreeRefund.iconSpan} ${refundState >= 4 ? agreeRefund.iconActive : ''}`}></div>
            </div>
            <div className={agreeRefund.processRight}>
              <p className={`f32 ${refundState >= 5 ? agreeRefund.active : ''}`}>退费中</p>
            </div>
          </div>
          <div className={agreeRefund.processItem}>
            <div className={agreeRefund.processLeft}>
              <div className={`${agreeRefund.icon} ${refundState == 5 ? agreeRefund.iconActive : ''}`}><i className={`iconfont icontk f20`}></i></div>
            </div>
            <div className={`${agreeRefund.processRight}`}>
              <p className={`f32 ${refundState == 5 ? agreeRefund.active : ''}`}>已退款</p>
            </div>
          </div>
        </div>
        <div className={agreeRefund.contactService}>
          <div className={agreeRefund.contactServiceBtn} onClick={() => this.contactService(userName)}>
            <i className={`iconfont iconkefuhongse f42`}></i>
            <span className={`f32`}>联系客服</span>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    userName: state.all.userName
  }
}

export default connect(mapState)(AgreeRefund)
