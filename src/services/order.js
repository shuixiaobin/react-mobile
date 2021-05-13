import request from '../utils/request'
import servicesUrl from "@/utils/config";
const { baseJavaUrl } = servicesUrl;
// 预下单
export function getWillOrder(params) {
  return request.get(`${baseJavaUrl}/c/v6/order/place`, {
    params,
    headers: {
      cv: "7.2.250",
      terminal: 7,
      token: getCookie("ht_token") 
    }
  })
}

// 下单
export function putOrder(params) {
  return request.post(`${baseJavaUrl}/c/v6/order/create`, {
    params,
    headers: {
      cv: "7.2.250",
      terminal: 7,
      token: getCookie("ht_token") 
    }
  })
}
// 0元课
export function zero_order(params) {
  return request.post(`/lumenapi/v5/c/order/zero_order`, {
    form: { ...params }
  })
}

// 查询支付结果
export function getOrderResult(params) {
  return request.get(`/lumenapi/v5/c/order/order_status`, {
    params
  })
}

//拼团订单查询结果
export function getOrderJieguo(params) {
  return request.get(`/lumenapi/v5/c/collage/collage_order_status`, {
    params
  })
}

// 查询指定地址
export function getTheAddress(params) {
  return request.get(`/lumenapi/v4/common/user/address`, {
    params
  })
}

// 获取订单列表
export function getOrderList(params) {
  return request.get(`/lumenapi/v4/common/order/list`, {
    params
  })
}

// 订单详情
export function getOrderDetail(params) {
  return request.get(`/lumenapi/v4/common/order/detail`, { params })
}

// 物流信息
export function getOrderLogistics(params) {
  return request.get(`/lumenapi/v4/common/order/logistics`, { params })
}

// 继续支付
export function orderContinuePay(params) {
  return request.post(`/lumenapi/v5/c/order/order_continue_pay`, {
    form: { ...params }
  })
}

// 取消订单
export function cacelOrder(params) {
  return request.put(`/lumenapi/v4/common/order/cacel`, {
    json: { ...params }
  })
}

export function deleteOrder(params) {
  return request.delete('/lumenapi/v4/common/order/delete', {
    json: params
  })
}


//获取openid
export function getOpenId(params) {
  return request.get(`/lumenapi/v5/c/order/user_openid`, { params })
}


/* 
下面是拼团下单相关的
*/


//预下单，发起团
export const createGroup = params =>
request.post(`${baseJavaUrl}/c/v4/orders/pre/collage/create`, {
    params,
    headers: {
      cv: "7.1.5",
      terminal: 7,
      token: getCookie("ht_token") 
    }
});


//预下单，参与拼团
export const joinGroup = params =>
request.post(`${baseJavaUrl}/c/v4/orders/collage/join`, {
  params,
  headers: {
    cv: "7.1.5",
    terminal: 7,
    token: getCookie("ht_token") 
  }
});

//下单
export const orderGroup = params =>
request.post(`${baseJavaUrl}/c/v4/orders/collage/create`, {
  params,
  headers: {
    cv: "7.1.5",
    terminal: 7,
    token: getCookie("ht_token") 
  }
});


/**
 * 下面是新协议相关的接口
 */
// 协议配置信息
export const  getProtocolConfig = params => {
   return request.get(`/lumenapi/v6/c/protocol/config`, { params })
}

// 协议保存
export const savUserProtocol = params =>
request.post(`/lumenapi/v6/c/protocol/save_user_protocol`, {
  params,
  headers: {
    cv: "7.1.5",
    terminal: 7,
    token: getCookie("ht_token") 
  }
});

// 获取新协议信息
export const getUserProtocolInfo = params => {
  return request.get('/lumenapi/v6/c/protocol/user_protocol', { params })
}

// 补充协议信息保存
export const saveSupplementaryProtocol = params =>
request.post(`/lumenapi/v6/c/protocol/supplementary_protocol`, {
  params,
  headers: {
    cv: "7.1.5",
    terminal: 7,
    token: getCookie("ht_token") 
  }
});

// [协议课]-契约锁签协议-用户信息认证
export const personalIdentify = params =>
request.post(`/lumenapi/v6/pc/protocol/personal_identify`, {
  params,
  headers: {
    cv: "7.1.5",
    terminal: 7,
    token: getCookie("ht_token") 
  }
});

// [协议课]-个人认证之后-获取签署合同地址
export const getVerifyResult = params => {
  return request.get('/lumenapi/v6/pc/protocol/contract_page_flag', { params })
}

// [协议课]-获取契约锁合同签署结果
export const getSignResult = params => {
  return request.get('/lumenapi/v6/pc/protocol/contract_result', { params })
}

// [协议课]-flag获取个人认证时的参数
export const getContractFlagParams = params => {
  return request.get('/lumenapi/v6/pc/protocol/contract_flag_params', { params })
}

// [协议课]-退费进度状态
export const getRefundState = params => {
  return request.get('/lumenapi/v6/pc/protocol/refund_state', { params })
}