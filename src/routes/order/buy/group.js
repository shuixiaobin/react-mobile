import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import PropTypes from 'prop-types'
import { Toast, Button } from 'antd-mobile'
import * as order from '@/services/order'
import Activity from '@/routes/classDetail/components/Activity'
import ActivityDetail from '@/routes/classDetail/components/ActivityDetail'
import OrderPrice from '../components/orderPrice'
import buy from './buy.less'
import { getCookie, getNormalCookie, parse_url, wxSdkPay,setCookie } from '@/utils/global'

class Order extends React.Component {
  static contextTypes = {
    wantCustomer: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      wxCode: '',
      hasProtocol: false,
      buyType: '33', // 1：图币支付 33微信支付 32支付宝支付
      isPadding: false
    }
  }

  componentDidMount() {
    this.getGrpOrderInfo() // 订单详情
  }

  getGrpOrderInfo() {// 订单详情
    const { location, dispatch } = this.props
    const search = qs.parse(location.search)
    const { groupId, isJoin ,classId} = search
    // isJoin--》1参与拼团，0发起拼团
    if(isJoin > 0){
      var p = order.joinGroup({
        groupId,
        cv: "7.1.5",
        terminal: 7,
        token: getCookie("ht_token") 
      })
    }else{
      var p = order.createGroup({
        activityId:groupId,
        cv: "7.1.5",
        terminal: 7,
        token: getCookie("ht_token") 
      })
    }
   
    p.then(res => {
        dispatch({
          // 课程优惠活动
          type: 'classDetail/getActivityList',
          payload: {
            classId
          }
        })
        return new Promise((resolve, reject) => {
          if (search.addressId) {
            // 设置重新选的收货地址
              order.getTheAddress({
                catchOne: 2,
                userName: getCookie('UserName'),
                id: search.addressId
              })
              .then(item => {
                const obj = {
                  address: item.address,
                  area: item.area,
                  areaId: item.areaId,
                  city: item.city,
                  cityId: item.cityId,
                  consignee: item.name,
                  id: item.id,
                  phone: item.phone,
                  province: item.province,
                  provinceId: item.provinceId
                }
                // Object.assign(res.address, obj)
                res.address=obj;
                resolve(res)
              })
              .catch(err => {
                resolve(res)
              })
          } else {
            resolve(res)
          }
        })
      })
      .then(res1 => {
        this.setState({
          list: res1,
          hasProtocol: res1.hasProtocol
        })
      }).catch(error =>{
        typeof error === 'string' ? Toast.fail(error,3,() => {
          dispatch(
            routerRedux.goBack()
          )
        }) : Toast.offline('服务器错误!')
      })
  }


  pullToPay() {
    // 拉起支付
    const { list, buyType, hasProtocol, isPadding } = this.state
    const { location, dispatch } = this.props
    const search = qs.parse(location.search)
    const { groupId, isJoin } = search
  
    if (isPadding) {
      // 重复点击
      console.log('你点的太快了')
      return
    }
    if (list.isLogistics > 0 && !list.address) {
      Toast.info('请填写地址信息！')
      return
    }
    if (hasProtocol == 1) {
      Toast.info('请填写协议！')
      return
    }
    const payType = wxSdkPay.isWxBrowser() ? 0 : 1;
    this.setState({ isPadding: true });

    const param={// 下单
      addressId: list.isLogistics > 0 ?list.address.id:'',
      cv:"7.1.5",
      openId: getNormalCookie('UserOpen'),
      payment: buyType,
      terminal: 7,
      wxH5: payType,
    };
    isJoin > 0 ?param.groupId=groupId : param.activityId=groupId;

    order.orderGroup(param).then(res => {
        this.setState({
          isPadding: false
        })
        if (payType == 1) {// h5支付
          if(buyType=='32'){// 支付宝
            console.log("拉支付宝")
            let div
            if(document.getElementsByClassName("zhifubao").length > 0){
              div=document.getElementsByClassName("zhifubao")[0]
            }else{
              div=document.createElement('div');
              div.className="zhifubao"; 
            }
            div.innerHTML=res; 
            document.body.appendChild(div);
            // document.forms[0].setAttribute('target', '_blank');
            // document.forms[0].submit();
            // document.forms['alipaysubmit'].setAttribute('target', '_blank');
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
              pathname: '/class/buyBackGrp',
              search: qs.stringify({
                sdkPay: 1
              })
            })
          )
        }else if (res == 'payCancel') {
          Toast.fail('支付取消')
        }
      })
      .catch(e => {
        Toast.fail(e)
      })
  }

  toSelectAddress(id) {
    const { location, dispatch } = this.props
    const search = qs.parse(location.search)
    setCookie('isGroup', 1);
    dispatch(
      routerRedux.push({
        pathname: '/other/addressList',
        search: qs.stringify({
          ...search,
          orderAddressId: id
        })
      })
    )
  }

  toProtocol() {
    const { location, dispatch } = this.props
    const { treatyId, protocolInfo, protocolName } = this.state.list
    const obj = { protocolId: treatyId, protocolName }
    if (protocolInfo && protocolInfo.rid) {
      obj.rid = protocolInfo.rid
    }
    setCookie('isGroup', 1);
    dispatch(
      routerRedux.push({
        pathname: '/user/signup',
        search: qs.stringify({
          ...obj
        })
      })
    )
  }

  choosePay(type) {
    this.setState({
      buyType: type
    })
  }

  toNotice() {
    const { location, dispatch } = this.props
    const { list, hasProtocol } = this.state
    dispatch(
      routerRedux.push({
        pathname: '/class/notice',
        search: qs.stringify({
          name: list.cateName,
          title: list.title,
          href: encodeURI(window.location.href),
          classImg: list.scaleimg
        })
      })
    )
  }

  render() {
    const { list, hasProtocol } = this.state
    const { userName, isShow, location } = this.props
    const search = qs.parse(location.search)
    const { groupId } = search
    const Protocol = list.protocolInfo
    const _this = this
    if (this.context.wantCustomer) {
      PresaleClassCustomer({
        name: list.cateName,
        userInfo: userName,
        title: list.title,
        href: window.location.href,
        classImg: list.scaleimg
      })
    }
    return (
      <>
        <div
          className={buy.total}
          style={isShow ? { filter: 'blur(3px)' } : null}
        >
          <ul className={buy.parent}>
            {hasProtocol == 0 ? (
              ''
            ) : hasProtocol == 1 ? (
              <li
                className={buy.agreement}
                onClick={() => {
                  this.toProtocol()
                }}
              >
                <div>
                  <p>
                    <span>签订协议</span>{' '}
                    <i
                      className={`${buy.loadNext} iconfont iconbianzux3 f36`}
                    />
                  </p>
                </div>
              </li>
            ) : (
              <li>
                <div className={buy.pTitle}>
                  <p className={buy.ProtocolTitle}>签订协议</p>
                  <Button
                    onClick={() => {
                      this.toProtocol()
                    }}
                    className={buy.editProtocol}
                  >
                    <p>查看协议</p>
                  </Button>
                </div>
                <div className={buy.Protocol}>
                  <ul>
                    <li>
                      <p>
                        姓 名：<span>{Protocol.studentName}</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        性别：<span>{Protocol.sex == 1 ? '男' : '女'}</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        手机号码：<span>{Protocol.telNo}</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        身份证号：<span>{Protocol.idCard}</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        针对考试：<span>{Protocol.forExam}</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        准考证号：<span>{Protocol.examCertifacteNo}</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        退费银行：<span>{Protocol.feeBank}</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        银行户名：<span>{Protocol.feeAccountName}</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        银行账号：<span>{Protocol.feeAccountNo}</span>
                      </p>
                    </li>
                  </ul>
                </div>
              </li>
            )}

            <li>
              <div>
                {list.isLogistics >0 ?(!list.address || (list.address && list.address.length == 0) ? (
                  <div className={buy.address}>
                    <p
                      className={buy.pleaseAddress}
                      onClick={() => this.toSelectAddress('')}
                    >
                      请填写详细地址{' '}
                      <i
                        className={`${buy.loadNext} iconfont iconbianzux3 f36`}
                      />
                    </p>
                  </div>
                ) : (
                  <div className={buy.orderAddress}>
                    <ul>
                      <li className={buy.areaLabel}>
                        <p className={buy.who}>
                          <span>{list.address.consignee}</span>
                          <span>{list.address.phone}</span>
                        </p>
                      </li>
                      <li onClick={() => this.toSelectAddress(list.address.id)}>
                        <p className={buy.area}>
                          {list.address.province}
                          {list.address.city}
                          {list.address.area}
                          {list.address.address}
                        </p>
                        <i
                          className={`${
                            buy.loadNext
                          } iconfont iconbianzux3 f36`}
                        />
                      </li>
                    </ul>
                  </div>
                )):''}
              </div>
            </li>

            {list.length == 0 ? (
              ''
            ) : (
              <li className={buy.buyClass}>
                <div className={buy.classDetail}>
                  <p className={buy.classTitle}>
                    <span className={buy.span3}>{list.title}</span>{' '}
                    {/* <span className={buy.span5}>{list.price}</span>  <span className={buy.span4}>￥</span> */}{' '}
                  </p>
                  <div className={buy.classBrief}>
                    <p className={buy.span1}>{list.brief}</p>{' '}
                    {/* <p className={buy.span2}>{`￥${list.actualPrice}`}</p> */}{' '}
                  </div>
                  <div className={`${buy.classTeacher} clearfix`}>
                    <div className={buy.teacher}>
                      {[].concat(list.teacherInfo).map((item, index) => (
                        <div className={buy.haha} key={index}>
                          {' '}
                          <p className={buy.teacherImg}>
                            <img
                              className=" br50"
                              src={item && item.roundPhoto}
                              alt=""
                            />
                          </p>{' '}
                          <p>{item && item.teacherName}</p>
                        </div>
                      ))}
                    </div>
                    <span className={buy.classTime}>{list.timeLength}课时</span>
                  </div>
                </div>
              </li>
            )}

            {list.length == 0 || list.exposition.length == 0 ? (
              ''
            ) : (
              <li className={buy.present}>
                <div className={buy.title}>
                  <span>申论批改服务</span>{' '}
                  <img src="//p.htwx.net/m/order-zp.png" alt="" />
                </div>
                <div className={buy.presentBody}>
                  {list.exposition.map((item, index) => (
                    <div key={index}>
                      <p className={buy.body}>
                        <span className={buy.left}>
                          {' '}
                          {`${item.title} X ${item.count}`}{' '}
                        </span>
                        <span className={buy.right}>
                          {' '}
                          {`${item.expireDate}`}{' '}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </li>
            )}
            <li className={buy.activity}>
              <Activity />
            </li>
            {/* <Item className={buy.sale}>
            <div><p><span>促销</span> <span className={buy.limit}>{list.limit}</span> <i className={`${buy.loadNext} iconfont iconbianzux3`}></i></p></div>
          </Item> */}
            <li className={buy.price}>
              <ul>
                <li>
                  <h2>
                    商品金额 <span>￥{list.price}</span>
                  </h2>{' '}
                </li>
                <li>
                  <h2>
                    拼团免减 <span style={{color:"#FF3F47"}}>-￥{list.moneyDisCount}</span>
                  </h2>
                </li>
                {
                  Number(list.logisticsCost) !== 0 ? (
                  <li>
                    <p>
                      运费 <span>+￥{list.logisticsCost}</span>
                    </p>
                  </li>
                  ) : null
                }
                <li>
                  <h2>
                    实付款 <span>￥{list.actualPrice}</span>
                  </h2>{' '}
                </li>
              </ul>
            </li>
            <OrderPrice choosePayType={this.choosePay.bind(_this)} orderPrice={list.actualPrice} hbInfo={list.hbFqInfo} groupId={groupId} />
            <li className={buy.dddd}>
              <div>
                <div className={buy.quan} />
                <p onClick={this.toNotice.bind(_this)}>
                  已阅读华图在线购课须知并严格遵守 <span>（查看须知）</span>
                </p>
              </div>
            </li>
            <li className={buy.submit}>
              <div className={buy.number}>
                <p className={buy.jiage}>￥{list.actualPrice}</p>
                <p className={buy.youhui}>已优惠 ¥ {list.moneyDisCount}</p>
              </div>
              <div className={buy.pay} onClick={this.pullToPay.bind(_this)}>
                <p>立即支付</p>
              </div>
            </li>
          </ul>
        </div>
        <ActivityDetail />
      </>
    )
  }
}

Order.propTypes = {}

function mapState(state) {
  return {
    userName: state.all.userName,
    isShow: state.classDetail.isShow
  }
}

export default connect(mapState)(Order)
