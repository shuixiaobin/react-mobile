import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Toast } from 'antd-mobile'
import PropTypes from 'prop-types'
import Head from './components/head/root'
import OrderClass from './components/orderClass/root'
import Prices from './components/prices/root'
import Info from './components/info/root'
import OrderPay from '../components/orderPrice'
import ActivityDetail from '@/routes/classDetail/components/ActivityDetail'
import detail from './detail.less'
import { getOrderDetail, orderContinuePay, cacelOrder , getOpenId, getContractFlagParams, getSignResult, savUserProtocol} from '@/services/order'
import { getCookie,getNormalCookie,setCookie, parse_url, wxSdkPay } from '@/utils/global.js'

class OrderDetail extends React.Component {
  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props)
    this.state = {
      order: {},
      userMobile: '',
      buyType: '33',
      isPadding: false,
      hbFqNum:'',
      signParams: {}
    }
  }

  static contextTypes = {
    wantCustomer: PropTypes.bool
  }

  componentDidMount() {
    const { location } = this.props
    const search = qs.parse(location.search)
    if (search.flag) {
      this.getContractFlagParams(search.flag)
    } else {
      this.getOrderDetail()
    }
    
  }

  getContractFlagParams = async (flag) => {
    try {
      const data = await getContractFlagParams({ flag: flag })
      this.setState({ orderId: data.order_id, contract_id: data.contract_id, signParams: data }, () => {
        this.getSignResult(this.state.contract_id) //获取签署结果状态
      })
    } catch (error) {
      Toast.info(error)
    }
  }

  getSignResult = async (contract_id) => {
    try {
      const data = await getSignResult({contract_id:contract_id})
      // state==1 签署成功
      if (data.state == 1) {
        this.savUserProtocol()
      } else {
        dispatch(
          routerRedux.push({
            pathname: '/user/resign',
            search: qs.stringify({
              contract_id: contract_id,
              classId: this.state.class_id
            })
          })
        )
      }
    } catch (error) {
      Toast.info(error)
    }
  }

  savUserProtocol = async () => {
    const {signParams} = this.state
    const params = {
      user_name: signParams.username,
      class_id: signParams.class_id,
      student_name: signParams.name,
      mobile: signParams.mobile,
      id_card: signParams.id_card,
      order_id: signParams.order_id,
      order_no: signParams.order_no,
      exam_card_code: signParams.exam_card_code,
      province: signParams.province,
      contract_id: signParams.contract_id
    }
    try {
      const data = await savUserProtocol(params)
      this.getOrderDetail()
    } catch (error) {
      Toast.info(error)
    }
  }

  // 订单详情
  getOrderDetail = async () => {
    try {
      const {
        location: { search }
      } = this.props
      const data = await getOrderDetail({
        orderId: qs.parse(search).orderId ? qs.parse(search).orderId : this.state.orderId
      })
      const { order } = this.state

      this.setState({
        order: { ...order, ...data },
        userMobile: `${String(data.mobile).substr(0, 3)}****${String(
          data.mobile
        ).substr(7, 11)}`
      })
    } catch (e) {
      Toast.fail(e)
    }
  }

  choosePay = (type,huabei) => {
    this.setState({
      buyType: type,
      hbFqNum:''
    })
    if(huabei){ //花呗分期期数
      this.setState({
        hbFqNum: huabei //传过来的是下标
      })
    }
  }

  pullToPay(){//拉起支付
    const { dispatch } = this.props
    const { order, buyType, isPadding ,hbFqNum} = this.state
    let payType = ''
    if (isPadding) {
      // 重复点击
      return
    }
    this.setState({
      isPadding: true
    })
    payType = wxSdkPay.isWxBrowser() ? 0 : 1
    orderContinuePay({
      // code: wxSdkPay.wxCode,
      openId: getNormalCookie('UserOpen'),
      orderId: order.orderId,
      payment: buyType,
      source: '5',
      userName: getCookie('UserName') || 'app_ztk817878886',
      wxH5: payType,
      hbFqNum:hbFqNum?hbFqNum:undefined,
    })
      .then(res => {
        this.setState({
          isPadding: false
        })
        if (payType == 1) {
          if(buyType=='32'){// 支付宝
            let div
            if(document.getElementsByClassName("zhifubao").length > 0){
              div=document.getElementsByClassName("zhifubao")[0]
            }else{
              div=document.createElement('div');
              div.className="zhifubao"; 
            }
            div.innerHTML=res; 
            document.body.appendChild(div);
            document.forms.alipaysubmit.submit()
          }else{
            window.location.href = res
          }
        } else {
          return wxSdkPay.wxToPay(res)
        }
      })
      .catch(e => {
        this.setState({
          isPadding: false
        })
        Toast.fail(e)
      })
      .then(res => {
        if (res == 'payOk') {
          console.log('支付成功')
          dispatch(
            routerRedux.push({
              pathname: '/class/buyBack',
              search: qs.stringify({
                sdkPay: 1,
                money_receipt: order.price,
                class_id: order.classInfo && order.classInfo[0].rid ,
                class_type: order.classInfo&&order.classInfo[0].videoType,
                class_title:encodeURI(order.classInfo&&order.classInfo[0].title)
              })
            })
          )
        } else if(res == 'payCancel'){
          Toast.fail("支付取消")
        }
      })
      .catch(e => {
        Toast.fail(e)
      })
  }

  //  取消订单
  toCacelOrder = async () => {
    try {
      const { order } = this.state
      const data = await cacelOrder({
        orderId: order.orderId,
        userName: getCookie('UserName') || 'app_ztk817878886'
      })

      Toast.info('订单已取消')

      // 取消后更新页面状态
      if (data) this.getOrderDetail()
    } catch (e) {
      Toast.fail(e)
    }
  }

    notToPay(){
      Toast.info('您还没签署协议')
    }

  async toProtocol () {
    const { location, dispatch } = this.props
    const { treatyId, protocolInfo, protocolName ,orderNum, isNewAgreement, class_pay_type, template_id, isNeedSubmitProvince, classInfo} = this.state.order
    const obj = { protocolId: treatyId, protocolName , orderNum }
 /*    if (protocolInfo && protocolInfo.rid) {
      obj.rid = protocolInfo.rid;
    } */
    if (isNewAgreement == 1) {
      const search = qs.parse(location.search)
      dispatch(
        routerRedux.push({
          pathname: '/user/signupnew',
          search: qs.stringify({
            class_pay_type,
            template_id,
            class_id: classInfo&&classInfo[0].rid || '',
            back_type: 5,
            ...search,
            order_id: search.orderId,
            order_no: orderNum,
            isNeedSubmitProvince
          })
        })
      )
      return
    }
    setCookie('isGroup', '');
    dispatch(
      routerRedux.push({
        pathname: '/user/signup',
        search: qs.stringify({
          ...obj
        })
      })
    )
  }

  toNotice = () => {
    const { location, dispatch } = this.props
    dispatch(
      routerRedux.push({
        pathname: '/class/notice'
      })
    )
  }

  render() {
    const { myUrl, userName, isShow } = this.props
    const { order, userMobile } = this.state
    const _this = this;
    if (this.context.wantCustomer) {
      // eslint-disable-next-line no-unused-expressions
      order.payStatus === 0
        ? OrderCustomer({
            userInfo: userName,
            href: window.location.href
          })
        : JumpUserCustomer({ robotFlag: 1 }, userName)
    }

    return JSON.stringify(order) !== '{}' ? (
      <>
        <div
          id={detail.detailWrap}
          style={isShow ? { filter: 'blur(3px)' } : null}
        >
          {/* 订单状态，物流 */}
          <Head order={order} />
          {/* 收货地址 */}
          {order.address ? (
            <div className={`${detail.orderAddress} oh`}>
              <p className="fl">
                <img src={`${myUrl}order-address-icon.png`} alt="" />
                <span className="f24">收货地址</span>
              </p>
              <div className="fr f28">
                <p>
                  {order.name} {userMobile}
                </p>
                <p>{order.address}</p>
              </div>
            </div>
          ) : null}
          {/* 课程 */}
          <OrderClass
            order={order}
            protocolUrl={order.protocolUrl}
            goSign={this.toProtocol.bind(_this)}
            isSigned={order.hasProtocol}
            list={order.classInfo}
            showSignedButton={order.showSignedButton}
            protocolH5Url={order.protocolH5Url}
            isNewAgreement={order.isNewAgreement}
          />
          <Prices order={order} />
          <Info order={order} />
          {order.payStatus === 0 ? (
            <>
              <OrderPay choosePayType={this.choosePay}  orderPrice={order.price} hbInfo={order.hbFqInfo}/>
              <div className={detail.dddd}>
                <div className={detail.quan} />
                <p onClick={this.toNotice}>
                  已阅读华图在线购课须知并严格遵守 <span>（查看须知）</span>
                </p>
              </div>
              <div className={`${detail.payBtn} f32 oh`}>
                <div className="fl" onClick={this.toCacelOrder}>
                  取消订单
                </div>
                {
                  order.hasProtocol ==1 || (order.isNewAgreement == 1 && order.isNewAgreementSigned == 0) ? ( 
                    <div className={`${detail.notPay} fr`} onClick={this.notToPay.bind(_this)}>
                    立即支付
                    </div>
                  )
                  :(
                    <div className={`${detail.canPay} fr`} onClick={this.pullToPay.bind(_this)}>
                    立即支付
                    </div>
                  )
                }
              </div>
            </>
          ) : null}
        </div>
        <ActivityDetail />
      </>
    ) : null
  }
}

const mapState = state => ({
  myUrl: state.all.myUrl,
  userName: state.all.userName,
  isShow: state.classDetail.isShow
})

export default connect(mapState)(OrderDetail)
