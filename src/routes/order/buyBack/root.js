import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import back from './back.less'
import * as order from '@/services/order'
import { ToApp, openQRcode } from '@/utils/setSensors'
import { getCookie } from '@/utils/global'
import { getCode , getClassByOrder} from "@/services/javaApi";
import QrCode from "@/components/qrCode/root";

class BuyBack extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      result: '',
      modal: false,
      codeInfo: {},
      classInfo:{},
      goClassFlag:false
    }
  }

  componentDidMount() {
    const { location } = this.props
    const search = qs.parse(location.search)

    if (search.orderId) {//h5支付
      getCode({ classId: 0, orderId: search.orderId })
      .then((res) => {
        if (res.service !== 0 && getCookie("payRefer") == null) {
            this.setState({
              modal: true,
              codeInfo: res,
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
      this.getResulet()
    } else if (search.sdkPay) { //微信SDK支付
      if(search.money_receipt < 100){
        this.setState(
          {
            result: 1,
            goClassFlag:true,
            classInfo:{ 
              class_id:search.class_id,
              class_type:search.class_type,
              class_title: search.class_title
            }
        })
      }else{
        this.setState({goClassFlag:false, result: 1});
      }
    }
  }
  
  componentWillUnmount() {
    this.setState({
      result: ''
    })
  }

  setCalssInfo=()=>{
    const { location} = this.props
    const search = qs.parse(location.search);
    const userName = getCookie('UserName')
    getClassByOrder({
      order_id:search.orderId,
      user_name:userName,
    }).then(res=>{
      if(res.class[0].money_receipt < 100){
        this.setState(
          {
          goClassFlag:true,
          classInfo:{ 
            class_id:res.class[0] && res.class[0].class_id,
            class_type:res.class[0] && res.class[0].class_type,
            class_title: encodeURI(res.class[0] && res.class[0].class_title)
          }
        })
      }else{
        this.setState(
          {goClassFlag:false}
        )
      }
    })
  }

  goClass = () => {
    const {dispatch} = this.props;
    const {classInfo} = this.state;
    dispatch(routerRedux.push({
      pathname: '/class/afterClass',
      search: qs.stringify({ 
        classId:classInfo.class_id,
        classType:classInfo.class_type,
        title: classInfo.class_title
      })
    }))
  }

  goApp = () => {
    // 我的课程
    ToApp({
      on_page: '支付成功页'
    })
    window.location.href = `//ns.huatu.com/h5/index.html` 
  }

  goContinueBuy = () => {
    // 继续支付
    const { location, dispatch } = this.props
    const search = qs.parse(location.search)
    dispatch(
      routerRedux.replace({
        pathname: '/class/orderDetail',
        search: qs.stringify({
          orderId: search.orderId
        })
      })
    )
  }

  getResulet() {
    // 查询支付结果
    const { location } = this.props
    const search = qs.parse(location.search);
    var timer =null;
    order
      .getOrderResult({
        orderId: search.orderId
      })
      .then(res => new Promise(resolve => {
          if (res == 1) {
            resolve(res)
          } else {
            this.setState({
              result: ""
            });
            timer = setTimeout(() => {
              order
                .getOrderResult({
                  orderId: search.orderId
                })
                .then(res => {
                  resolve(res)
                })
            }, 4000)
          }
        }))
      .then(res => {
        console.log('getOrderResult:', res)
        this.setState({
          result: res
        });
        if(res ==1){
          this.setCalssInfo();
        }

        var urlBack= decodeURIComponent(getCookie("payRefer"));
        if(getCookie("payRefer") != null ){
          if(res ==1){
            urlBack = `${urlBack}?status=success`
          }else{

          }
          setTimeout(() => {
            window.location.href = urlBack;
          }, 1000)
        }

      })
  }

  handleClose = (flag) => {
    const { codeInfo } = this.state
    const POPUPTYPE = {
      1:'QQ群号',
      2:'微信',
      3:'关注公众号',
      4:'联系老师'
    }
    const currentCate = JSON.parse(sessionStorage.getItem('currentCate'))
    openQRcode({
      page_source: '购买成功首次唤起',
      popup_type: POPUPTYPE[codeInfo.service],
      collect_operation:'点击关闭',
      course_kind: currentCate && currentCate.name || '',
      course_id: '',
      course_title: '',
      is_free: false
    })
    this.setState({
      modal: flag,
    });
  };

  render() {
    const { result, modal, codeInfo, goClassFlag} = this.state
    const isInApp = getCookie("isAppUser")
    return result === '' ? (
      <div className={back.back}>
        <div>
          <img src="//p.htwx.net/m/payPadding.png" alt="" />
          <p className="f36">等待结果</p>
          <div className={`${back.bottom} f32`}>
            <p>支付状态正在同步，请稍后</p>
          </div>
        </div>
      </div>
    ) : (
      <div className={back.back}>
        {result !== '' ? (
          result === 1 ? (
            // 成功
            <>
              <div>
                <QrCode
                  modal={modal}
                  codeInfo={codeInfo}
                  handleClose={this.handleClose}
                />
                <svg
                  width="60px"
                  height="60px"
                  viewBox="0 0 60 60"
                  version="1.1"
                >
                  <g
                    id="支付页面备份-3"
                    transform="translate(-158.000000, -93.000000)"
                    fill="#68BF7B"
                    fillRule="nonzero"
                  >
                    <g id="编组" transform="translate(158.000000, 93.000000)">
                      <path
                        d="M30,0 C13.4571428,0 0,13.4571428 0,30 C0,46.5428572 13.4571428,60 30,60 C46.5428572,60 60,46.5428572 60,30 C60,13.4571428 46.5428572,0 30,0 Z M48,20.1428572 C48,20.1428572 32.3142857,37.4571429 28.8,41.5714286 C25.2857143,45.6857143 22.5428572,41.5714286 22.5428572,41.5714286 L12.3428572,31.0285714 C12.3428572,31.0285714 10.7142857,28.5428572 13.6285714,26.2285714 C16.3714286,24 18.6,26.2285714 18.6,26.2285714 L25.8,33.7714286 L43.7142857,17.0571428 C43.7142857,17.0571428 45.4285714,15.8571428 47.2285714,17.4 C48.6,18.6857143 48,20.1428572 48,20.1428572 L48,20.1428572 Z"
                        id="形状"
                      />
                    </g>
                  </g>
                </svg>
                <p className="f36">支付成功</p>
              </div>
      
              <div className={`${back.bottom} f32`}>
                {
                isInApp?(
                  <p>购买课程可在【学习】内查看学习</p>
                ):(
                    goClassFlag?(
                      <div>
                      <p>快去听课吧！</p>
                      <button className="f36" type="button" onClick={this.goClass}>
                          去听课
                      </button>
                    </div>
                    ):(
                      <div>
                        <p>为了更好的学习体验</p>
                        <p>请前往“华图在线”APP听课吧！</p>
                        <button className="f36" type="button" onClick={this.goApp}>
                            去APP听课
                        </button>
                      </div>
                    )
                  )
                }
              </div>
            </>
          ) : (
            // 失败
            <>
              <div>
                <svg
                  width="60px"
                  height="60px"
                  viewBox="0 0 60 60"
                  version="1.1"
                >
                  <g
                    id="支付页面备份-4"
                    transform="translate(-158.000000, -93.000000)"
                    fill="#FFB94D"
                    fillRule="nonzero"
                  >
                    <g id="编组" transform="translate(158.000000, 93.000000)">
                      <path
                        d="M30,0 C46.5428572,0 60,13.4571428 60,30 C60,46.5428572 46.5428572,60 30,60 C13.4571428,60 0,46.5428572 0,30 C0,13.4571428 13.4571428,0 30,0 Z M29.9069767,36 C30.8992298,36 31.4573637,35.50136 31.5813953,34.504065 L33.627907,22.1626016 C33.8759702,20.6666592 34,19.3577292 34,18.2357724 C34,14.8699019 32.6356726,13.1246619 29.9069767,13 C27.3023126,13.1246619 26,14.8699019 26,18.2357724 C26,19.3577292 26.1240298,20.6666592 26.372093,22.1626016 L28.4186047,34.504065 C28.5426363,35.50136 29.0387553,36 29.9069767,36 Z M30,47 C32.209139,47 34,45.209139 34,43 C34,40.790861 32.209139,39 30,39 C27.790861,39 26,40.790861 26,43 C26,45.209139 27.790861,47 30,47 Z"
                        id="形状结合"
                      />
                    </g>
                  </g>
                </svg>
                <p className="f36">支付失败</p>
              </div>
              <div className={`${back.bottom} f32`}>
                <p>点击“继续支付”按钮将前往待支付订单，</p>
                <p>继续完成支付</p>
                <button
                  className="f36"
                  type="button"
                  onClick={this.goContinueBuy}
                >
                  继续支付
                </button>
              </div>
            </>
          )
        ) : null}
      </div>
    )
  }
}

export default connect()(BuyBack)
