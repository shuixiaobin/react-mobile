import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux, withRouter } from 'dva/router'
import { Icon, Toast } from 'antd-mobile'
import card from '../userInforCard.less'
import * as order from '@/services/order'

// 这个页面协议第四步跳转 验证认证结果 最后一步验证签署结果让pc看
class UserInforCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flag: '',
      type: '', //有值的话给pc提示
      resultState: '',
      contract_id: '',
      signParams: {},
      showFlag: '',
      verifyFlag: ''
    }
  }
  componentDidMount() {
    const { location } = this.props
    const search = qs.parse(location.search)
    this.setState({ ...search }, () => {
      this.getContractFlagParams(this.state.flag)
    })
  }

  getContractFlagParams = async (flag) => {
    try {
      const data = await order.getContractFlagParams({ flag: flag })
      this.setState({contract_id:data.contract_id,signParams:data},()=>{
        if (this.state.type) {
          this.getSignResult(this.state.contract_id)
        } else {
          this.getVerifyResult()
        }
      })
    } catch (error) {
      Toast.info(error)
    }
  }

  getVerifyResult = async () => {
    try {
      const data = await order.getVerifyResult({ flag: this.state.flag })
      window.location.href = data.page_url
    } catch (error) {
      this.setState({verifyFlag: 'error'})
      Toast.info(error)
    }
  }

  getSignResult = async (contract_id) => {
    try {
      const data = await order.getSignResult({contract_id:contract_id})
        if (data.state == 1) {
          this.setState({showFlag: 'success'})
          if (!this.state.signParams.order_no) {
            this.savUserProtocol() //前端保存协议信息
          }
        } else {
          this.setState({showFlag: 'error'})
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
      if (data && data.protocol_id) {
        this.setState({showFlag: 'success'})
      }
    } catch (error) {
      this.setState({showFlag: 'error'})
      Toast.info(error)
    }
  }

  render() {
    const { type, showFlag, verifyFlag } = this.state
    return (
      <div id={card.userInfor}>
        {
          type ? (
            <div className={`${card.signResult} ${card.resign}`}>
              {/* showFlag有值 成功 */}
              {!showFlag ? '' : showFlag == 'success' ? (
                <p className={`f32`}>合同签署成功，请到pc端进行下一步操作</p>
              ) : (
                <>
                  <p className={`f32`}>合同签署失败，请刷新页面或重新签署</p>
                  <p className={`${card.resignBtn} ${card.btnSubmit}`} onClick={e => window.location.reload()}>刷新</p>
                </>
              )}
            </div>
          ) : (
            <div className={`${card.signResult} ${card.resign}`}>
              
              {
                verifyFlag == 'error' ? (
                  <>
                    <p className={`f32`}>认证失败，请刷新重试</p>
                    <p className={`${card.resignBtn} ${card.btnSubmit}`} onClick={e => window.location.reload()}>刷新</p>
                  </>
                ) : (
                  <>
                    <div><Icon type="loading" size="lg" /></div>
                    <p className={`f32`}>结果认证中...</p>
                  </>
                )
              }
              
            </div>
          )
        }
      </div>
    )
  }
}

export default withRouter(connect()(UserInforCard))
