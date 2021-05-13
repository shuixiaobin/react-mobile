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
import { getCookie, getNormalCookie,getQueryStr, parse_url, wxSdkPay,setCookie } from '@/utils/global'

class Order extends React.Component {
  static contextTypes = {
    wantCustomer: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      wxCode: '',
      hbFqNum:'',
      hasProtocol: false,
      buyType: '33', // 1：图币支付 33微信支付 32支付宝支付
      isPadding: false,
      totalServiceCharge: 0, //花呗分期总额
      notice: '',
      signParams: {},
      newProtocolId: ''
    }
  }

  componentDidMount() {
    const { location, dispatch } = this.props
    const search = qs.parse(location.search)
    if (search.flag) {
      this.getContractFlagParams(search.flag)
      return
    }
    this.getOrderInfo() // 订单详情
  }

  getContractFlagParams = async (flag) => {
    try {
      const data = await order.getContractFlagParams({flag:flag})
      this.setState({
        classId: data.class_id,
        contract_id: data.contract_id,
        signParams: data
      },() => {
        this.getSignResult(this.state.contract_id) //获取签署结果状态
      })
    } catch (error) {
      Toast.info(error)
    }
  }
  
  getSignResult = async (contract_id) => {
    try {
      const data = await order.getSignResult({contract_id:contract_id})
      // state==1 签署成功 保存协议信息
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
      order_no: signParams.order_no,
      order_id: signParams.order_id,
      exam_card_code: signParams.exam_card_code,
      province: signParams.province,
      contract_id: signParams.contract_id
    }
    try {
      const data = await order.savUserProtocol(params)
      this.setState({newProtocolId:data.protocol_id}, () => {
        this.getOrderInfo()
      })
    } catch (error) {
      Toast.info(error)
    }
  }

  getOrderInfo() {// 订单详情
    const { location, dispatch } = this.props
    const search = qs.parse(location.search)
    const { classId, goodsId, courseId, lessionId } = search
    order.getWillOrder({
        classId: classId ? classId : this.state.classId,
        goodsId,
        courseId, //直播带货上报所需要的课程id 
        lessionId, //直播带货上报所需要的课件id
        pageSource: encodeURIComponent(document.referrer)
      })
      .then(res => {
        dispatch({
          // 课程优惠活动
          type: 'classDetail/getActivityList',
          payload: {
            classId: classId ? classId : this.state.classId
          }
        })
        return new Promise((resolve, reject) => {
          if (search.addressId) { //重新选择收货地址的流程
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
        console.log(res1)
        this.setState({
          list: res1,
          hasProtocol: res1.hasProtocol
        })
        // 协议课，获取协议配置
        if (res1.hasProtocol == 1 || res1.isNewAgreement == 1) {
          order.getProtocolConfig({class_id: classId ? classId : this.state.classId}).then(res => {
            this.setState({
              notice: res.notice
            })
          })
        }
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
    const { list, buyType, hasProtocol, isPadding ,hbFqNum, contract_id} = this.state
    const { location, dispatch } = this.props
    const search = qs.parse(location.search)

    if (isPadding) {
      // 重复点击
      console.log('你点的太快了')
      return
    }
    if (list.isLogistics > 0 && !list.address) {
      Toast.info('请填写地址信息！')
      return
    }
    if (hasProtocol == 1 || (list.isNewAgreement && !contract_id)) {
      Toast.info('请填写协议！')
      return
    }
    const payType = wxSdkPay.isWxBrowser() ? 0 : 1;
    this.setState({ isPadding: true });
    order.putOrder({
        // 下单
        actualPrice: list.actualPrice,
        addressId: list.isLogistics > 0 ?list.address.id:'',
        classId: search.classId ? search.classId : this.state.classId,
        goodsId: search.goodsId,
        courseId: search.courseId, //直播带货上报所需要的课程id 
        lessionId: search.lessionId, //直播带货上报所需要的课件id
        // code: wxSdkPay.wxCode,
        userProtocolId:list.protocolInfo &&list.protocolInfo.rid,
        openId: getNormalCookie('UserOpen'),
        p: list.p,
        pageSource: document.referrer,
        payment: buyType,
        source: '5',
        wxH5: payType,
        tjCode: getCookie('tjCode'),
        unionData: getCookie('uniondata'),
        jzlContent:getCookie('jzlContent'),
        hbFqNum:hbFqNum?hbFqNum:undefined,
        thirdPartyInfo:  getCookie('thirdPartyInfo'),
        activityChannel: getCookie("clueId"),
        depthReport: search.crmLeadsId ? 1:0,
        crmLeadsId: search.crmLeadsId,
        htzxUps:encodeURIComponent(getCookie('htzxUps') || ''),
        studentProtocolId: this.state.newProtocolId 
    }).then(res => {
      console.log(res);
        this.setState({
          isPadding: false
        })
        if (payType == 1) {// h5支付
    
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
                money_receipt: list.actualPrice,
                class_id:search.classId ? search.classId : this.state.classId,
                class_type:list.courseType,
                class_title:encodeURI(list.title)
              })
            })
          )
        } else if (res == 'payCancel') {
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
    setCookie('isGroup', '');
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
    // class_pay_type 支付类型 1全款 2预收 0不是新协议
    // isNewAgreement 1新协议 0不是
    const { treatyId, protocolInfo, protocolName, isNewAgreement, class_pay_type, template_id, isNeedSubmitProvince } = this.state.list
    const obj = { protocolId: treatyId, protocolName }
    if (protocolInfo && protocolInfo.rid) {
      obj.rid = protocolInfo.rid
    }
    setCookie('isGroup', '');
    if (isNewAgreement == 1) {
      // 新协议课程进入新的签协议流程
      const search = qs.parse(location.search)
      dispatch(
        routerRedux.push({
          pathname: '/user/signupnew',
          search: qs.stringify({
            class_pay_type,
            template_id,
            isNeedSubmitProvince,
            class_id: search.classId ? search.classId : this.state.classId,
            back_type: 4,
            ...search
          })
        })
      )
    } else {
      dispatch(
        routerRedux.push({
          pathname: '/user/signup',
          search: qs.stringify({
            ...obj
          })
        })
      )
    }
  }

  choosePay(type,huabei) {
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

  // 获取花呗分期手续费总额
  getTotalServiceCharge = (totalPrice) => {
    this.setState({
      totalServiceCharge: totalPrice
    })
  }

  render() {
    const { list, hasProtocol, totalServiceCharge, notice, newProtocolId, signParams } = this.state
    const { userName, isShow, location } = this.props
    const Protocol = list.protocolInfo || {}
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
    
    const search = qs.parse(location.search)
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
            <>
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
                {list.hasProtocol == 1 ? (
                  <li>
                  <div className={buy.protocolTip}>
                    <span className={buy.protocolTipText}>{notice}</span>
                  </div>
                </li>) : null}
            </>
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
                    {/* <li>
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
                    </li> */}
                  </ul>
                </div>
              </li>
            )}
            {/*list.isNewAgreement == 1 && newProtocolId 说明从泛微跳回来并且保存协议成功了 */}
            { list.isNewAgreement == 0 ? '' : newProtocolId ? (
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
                      姓 名：<span>{signParams.name}</span>
                    </p>
                  </li>
                  <li>
                    <p>
                      手机号码：<span>{signParams.mobile}</span>
                    </p>
                  </li>
                  <li>
                    <p>
                      身份证号：<span>{signParams.id_card}</span>
                    </p>
                  </li>
                </ul>
              </div>
            </li>
            ) : (
              <>
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
              {list.isNewAgreement == 1 ? (
                <li>
                <div className={buy.protocolTip}>
                  <span className={buy.protocolTipText}>{notice}</span>
                </div>
              </li>) : null}
              </>
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
                    {     
                      list.address.provinceId =="650000" ?
                        <li className={buy.lastOne}>
                          <p>注意：由于疫情影响，【新疆】暂不能邮寄图书，发货时间另行通知。</p>
                        </li> :''
                    }
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
                          <p className={buy.teacherName}>{item && item.teacherName}</p>
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
            {/* 主观题批改 */}
            {
              list.classSubMarkInfo && list.classSubMarkInfo.effectiveDate ? (
                <li className={buy.present}>
                  <div className={buy.title}>
                    <span>主观题批改</span>{' '}  
                    {
                      list.classSubMarkInfo.isPresent ? (
                        <img src="//p.htwx.net/m/order-zp.png" alt="" />
                      ) : null
                    }
                  </div>
                  <div className={buy.presentBody}>
                    <div>
                      <p className={buy.body}>
                        <span className={buy.left}>
                          共{list.classSubMarkInfo.subjectiveNum}次
                        </span>
                        <span className={buy.right}>
                          {list.classSubMarkInfo.effectiveDate}
                        </span>
                      </p>
                    </div>
                  </div>
                </li>
              ) : null
            }
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
                  <p>
                    立减 <span>-￥{list.calcDisCount}</span>
                  </p>
                </li>
                <li>
                  <p>
                    等级优惠 <span>-￥{list.memberDiscount}</span>
                  </p>
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
            <OrderPrice choosePayType={this.choosePay.bind(_this)}  orderPrice={list.actualPrice} hbInfo={list.hbFqInfo} getTotalServiceCharge={this.getTotalServiceCharge}/>  
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
              <p className={buy.jiage}>￥{list.actualPrice}
                {totalServiceCharge > 0
                  ? <span className={buy.totalServiceCharge}>{' '} + 手续费¥{totalServiceCharge}</span>
                  : null
                }
              </p>
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
