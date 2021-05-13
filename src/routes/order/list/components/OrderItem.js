/**
 * 合集，课程列表
 */
import React from 'react'
import style from '../list.less'
import { routerRedux } from 'dva/router'
import { Modal, Toast } from 'antd-mobile'
import { deleteOrder } from '@/services/order'
import { ToApp } from '@/utils/setSensors'

/**
 * noteList item 组件
 * @param {object} row 当前数据
 */
function OrderItem({ row, ...props }) {
  const { userName, dispatch } = props
  function handleDelete(e, id, isCollage) {
    e.stopPropagation()
    let type = 0
    if (isCollage !== 0) {
      type = 1
    }

    Modal.alert('', '确认删除吗？', [
      { text: '取消', onPress: () => console.log('cancel') },
      {
        text: '确认',
        onPress: () =>
          deleteOrder({ orderId: id, type, userName })
            .then(() => {
              dispatch({
                type: 'listView/handleDelete',
                payload: {
                  orderId: id
                }
              })
              Toast.info('删除成功', 1)
            })
            .catch(err => {
              Toast.fail(err)
            })
      }
    ])
  }
  function lookLogistics(e) {
    e.stopPropagation()
    Modal.alert('', '该功能仅华图在线App支持', [
      { text: '知道了', onPress: () => console.log('cancel') },
      {
        text: '去APP',
        onPress: () => {
          ToApp({
            on_page: '查看物流信息'
          })
          window.location.href = '//ns.huatu.com/h5/index.html'
        }
      }
    ])
  }
  function toOrderDetail(row) {
    //拼团订单，已取消和已退款进到订单详情，其他的进开团详情
    if(row.isCollage > 0){
      return;
    } 
    dispatch(
      routerRedux.push({
        pathname: '/class/orderDetail',
        search: qs.stringify({
          orderId:row.orderId
        })
      })
    )
  }

  function handleGroup({ collageOrderId }) {
    dispatch(
      routerRedux.push({
        pathname: '/class/group',
        search: qs.stringify({
          orderId: collageOrderId
        })
      })
    )
  }

  async function handleAgreeRefund(e,row) {
    e.stopPropagation()
    const { refund_state_url } = row
    if (refund_state_url) {
      window.location.href = refund_state_url
    }
  }

  function handleAddInfo(e,row) {
    e.stopPropagation()
    const { class_pay_type, orderNum, userName, needSupplementaryProtocol } = row
    if (class_pay_type == 2) {
      // 弹窗提示
      Modal.alert('', '请使用华图在线App上传', [
        { text: '取消', onPress: () => console.log('cancel') },
        {
          text: '去App上传',
          onPress: () => {
            ToApp({
              on_page: '补充协议'
            })
            window.location.href = `//ns.huatu.com/h5/index.html?type=35&needSupplementaryProtocol=${needSupplementaryProtocol}&orderNum=${orderNum}&classPayType=${class_pay_type}`
          }
        }
      ])
    } else {
      dispatch(
        routerRedux.push({
          pathname: '/class/addInfo',
          search: qs.stringify({
            order_no: orderNum,
            needSupplementaryProtocol: needSupplementaryProtocol,
            user_name: userName
          })
        })
      )
    }
  }

  
  return (
    <div className={style.orderItem} onClick={() => toOrderDetail(row)}>
      <div className={`${style.orderInfo} clearfix f24`}>
        
        <span className={`${style.orderNum} fl ellipsis`}>
          订单号:{row.orderNum}
        </span>
        <div className={`${style.statusWrapper} fr`}>
          {row.hasProtocol || row.isNewAgreement == 1 ? (
            <i className={`${style.pact} mr20`}>协议</i>
          ) : null}
          <span className={`${style.status} ${style.red}`}>
            {row.statusDesc}
          </span>
        </div>
      </div>
      <div className={style.classInfo}>
        {row.classInfo &&
          row.classInfo.length > 0 &&
          row.classInfo.map((item, index) => (
            <div className={style.classInfoItem} key={index}>
              <div className={`${style.classTitWrapper} clearfix`}>
                <h5 className={`${style.classTit} f28 ellipsis fl`}>
                  {item.title}
                </h5>
                <div className={`${style.money} fr`}>
                  <span className={style.actualPrice}>￥{item.finalPrice}</span>
                  <span className={style.price}>￥{item.price}</span>
                </div>
              </div>
              <div className={`${style.teacherWrapper} clearfix f24`}>
                <span className={`${style.teacherList} fl`}>
                  授课老师：{item.teachers}
                </span>
                <span className={`${style.classHour} fr`}>
                  {item.lessonCount}课时
                </span>
              </div>
            </div>
          ))}

        <div className={`${style.payWrapper}`}>
          {
            row.isCollage > 0 && row.collageAvatars && row.collageAvatars.length >0 ?
                <div className={`${style.bigImg} f24`} >
                    <ul>
                         {[].concat(row.collageAvatars).map((t,index) => (
                            <li className="br50" key={index}>
                                <p className="br50">
                                  <img src={t} alt=""/>
                                </p>
                            </li>
                          ))}
                    </ul>
                </div>:''
          }

          <div className={`${style.realPayment} f24`}>
           {(row.payStatus == 0 || row.payStatus == 2)?"需付款":'实付款'}  <b className="f28">￥{row.price}</b>
          </div>
          <div className={`${style.buttonWrapper}`}>
            {row.payStatus === 0 ? (
              <button type="button" className={`${style.goPay} fr f28`}>
                去支付
              </button>
            ) : null}
            {row.price === '0.00' ? (
              <button
                type="button"
                className={`${style.delete} fr f28 `}
                onClick={e => handleDelete(e, row.orderId, row.isCollage)}
              >
                删除订单
              </button>
            ) : null}
            
      {/* show_refund_button -- 0：不展示协议退费 1：展示协议退费
      needSupplementaryProtocol -- 0：不展示补充信息 1：填写补充信息 2：修改补充信息 3：浏览补充信息 */}
            {row.isNewAgreement && row.show_refund_button && row.refund_state_url ? (
              <button
                type="button"
                className={`${style.delete} fr f28 `}
                onClick={e => handleAgreeRefund(e, row)}
              >
                协议退费
              </button>
            ) : null}
            {row.isNewAgreement && row.needSupplementaryProtocol ? (
              <button
                type="button"
                className={`${style.delete} fr f28 `}
                onClick={e => handleAddInfo(e, row)}
              >
              补充信息
              </button>
            ) : null}
          
            {(row.isCollage == 1 || row.isCollage == 2) ? (
              <button
                type="button"
                className={`${style.delete} fr f28 `}
                onClick={e => handleGroup(row)}
              >
                开团详情
              </button>
            ) : null}

            {row.hasLogistics ? (
              <button
                type="button"
                className={`${style.delete} fr f28 `}
                onClick={e => lookLogistics(e)}
              >
                查看物流
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderItem
