import React from 'react'
import { connect } from 'dva'
import { Modal, Toast } from 'antd-mobile'
import CountDown from '@/components/CountDown/root'
import detail from '../../detail.less'
import { getOrderLogistics } from '@/services/order'
import { ToApp } from '@/utils/setSensors'

const { alert } = Modal

class OrderHead extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      logisticsInfor: {} // 地址
    }
  }

  async componentDidMount() {
    const { order } = this.props

    if (order.hasLogistics) this.getOrderLogistics()
  }

  // 获取物流信息
  getOrderLogistics = async () => {
    const { order } = this.props
    const { orderId } = order

    try {
      const { logisticsInfor } = this.state
      const { data } = await getOrderLogistics({ orderId, type: 1 })

      this.setState({
        logisticsInfor: { ...logisticsInfor, ...data }
      })
    } catch (e) {
      Toast.fail(e)
    }
  }

  // 跳转 app 物流信息
  toAppDetail = () => {
    const { order } = this.props
    const { orderId } = order
    alert('该功能仅华图在线App支持', '', [
      { text: '知道了' },
      {
        text: '去App',
        onPress: () => {
          ToApp({
            on_page: '查看物流信息'
          })
          window.location.href = `//ns.huatu.com/h5/index.html?type=11&orderId=${orderId}&isCollage=0`
        }
      }
    ])
  }

  render() {
    const { order } = this.props
    const { logisticsInfor } = this.state
    const {
      statusDesc,
      status,
      countDown,
      payStatus /** 0-未支付, 1-已支付, 2-已取消, 3-待确认 */,
      hasLogistics
    } = order

    return (
      <div className={`${detail.OrderHead}`}>
        <p className="fl f28" data-status={status}>
          {statusDesc}
        </p>
        <div className="fr">
          {payStatus === 0 && countDown > 0 ? (
            <p className={`f24 ${detail.settime}`}>
              <CountDown time={countDown} type={2} />
            </p>
          ) : null}

          {hasLogistics && JSON.stringify(logisticsInfor) !== '{}' ? (
            <>
              <p className={`f28 ${detail.address}`} onClick={this.toAppDetail}>
                {logisticsInfor.context}
                {/* lenght 39 */}
                {logisticsInfor.context.length > 38 ? <i>...</i> : null}
              </p>
              <p className={`f24 ${detail.overtime}`}>{logisticsInfor.ftime}</p>
            </>
          ) : null}
        </div>
      </div>
    )
  }
}

export default connect()(OrderHead)
