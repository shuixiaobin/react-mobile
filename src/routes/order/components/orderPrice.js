/**
 * 合集，课程列表
 */
import React, { Component } from 'react'
import buy from '../buy/buy.less'
import {wxSdkPay} from '@/utils/global.js'


class OrderPrice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      one: '33',
      huabei: false,
      huabeiIndex: 0
    }
  }

  chooseOne(a){
    const { choosePayType } = this.props
    choosePayType(a);
    this.setState({
      one: a,
      huabei: false
    });
  }

  setHuabei(){
    const {hbInfo,choosePayType, getTotalServiceCharge } = this.props;
    choosePayType("32",hbInfo[0].hbFqNum);
    // 选择花呗默认第一个选项，将第一个选项返回父组件
    getTotalServiceCharge && getTotalServiceCharge(hbInfo[0].totalServiceCharge)
    this.setState({
      one: 34,
      huabei: true,
      huabeiIndex:0
    });
  }

  setFqInfo(num,index, totalPrice){
    const { choosePayType, getTotalServiceCharge } = this.props
    getTotalServiceCharge && getTotalServiceCharge(totalPrice)
    choosePayType("32",num);
    this.setState({
      huabeiIndex: index
    });
  }


  render() {
    const { one ,huabei,huabeiIndex} = this.state;
    const { orderPrice ,hbInfo, groupId} = this.props;
    console.log(orderPrice);
    return (
      <div className={buy.wx}>
        <ul>
          <li><h2>支付方式：</h2></li>
          <li onClick={()=>this.chooseOne("33")}><p className="vxIcon"> <img src="//p.htwx.net/m/wxLogo.png" alt="" />微信支付</p>
            {one == "33"?<div className={`${buy.selectIcon} iconfont iconxingzhuangx f32`} />:<div className={buy.notIcon} />}
          </li>
          {wxSdkPay.isWxBrowser() ? '' : <li onClick={()=>this.chooseOne("32")}><p className="zfbIcon"> <img src="//p.htwx.net/m/zfbLogo.png" alt="" />支付宝支付</p> 
            {one == "32"?<div className={`${buy.selectIcon} iconfont iconxingzhuangx f32`} />:<div className={buy.notIcon} />}
          </li>}
          { wxSdkPay.isWxBrowser() || orderPrice  < 100 || groupId ? '' : <li onClick={()=>this.setHuabei()}><p className="zfbIcon"> <img src="//p.htwx.net/m/huabeifq.png" alt="" />花呗分期</p> 
            {one == "34"?<div className={`${buy.selectIcon} iconfont iconxingzhuangx f32`} />:<div className={buy.notIcon} />}
          </li>}

          {
            huabei && hbInfo && hbInfo.length > 0?
            <li style={{ height:90}}>
              {
                 hbInfo.map((item, index)=>{
                  return (<div  key={index}  className={`${buy.huabei} ${index == huabeiIndex? buy.huabeiActive:''}`}   onClick={()=>this.setFqInfo(item.hbFqNum,index, item.totalServiceCharge)}>
                    <p className={buy.qs}>￥{item.eachFee}*{item.hbFqNum}期</p>
                    <p className={buy.fei}>含手续费￥{item.eachServiceCharge}/期</p> 
                  </div> ) 
                }) 
              }
            </li>:''
          }
        </ul>
      </div>
    )
  }
}


export default OrderPrice
