import { connect } from 'dva'
import React, { Component } from 'react'
import { routerRedux, withRouter } from 'dva/router'
import { Toast, List, InputItem, Modal, Picker } from 'antd-mobile'
import card from '../userInforCard.less'
import * as order from '@/services/order'
import { getCookie } from '@/utils/global'

// 通过自定义 moneyKeyboardWrapProps 修复虚拟键盘滚动穿透问题
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(
  window.navigator.userAgent
)
let moneyKeyboardWrapProps
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault()
  }
}

const mPattern = /^[1]([3-9])[0-9]{9}$/ // 手机号正则
const cP = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ // 身份证号（18位）正则
const cP15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/ // 身份证号（15位）正则

class UserInforCard extends Component {
  state = {
    class_id: '',
    name: '',
    mobile: '',
    id_card: '',
    order_no: '',
    protocol_id: '',
    protocolUrl: '',
    protocolId: '',
    template_id: '',
    class_pay_type: '',
    protocolConfig: {},
    exam_card_code: '',
    provinceArr: [],
    back_type: '',
    contract_id: '' // 有该值说明是来重新签订的
  }

  componentDidMount() {
    const { location } = this.props
    const search = qs.parse(location.search)
    if (search.flag) {
      this.setState({ ...search }, () => {
        this.getContractFlagParams(search.flag)
      })
    } else {
      this.setState({ ...search }, () => {
        this.getProtocolConfig()
      })
    }

  }

  getContractFlagParams = async (flag) => {
    try {
      const data = await order.getContractFlagParams({ flag: flag })
      this.setState({ ...data,provinceArr: data.province ? [data.province] : [] }, () => {
        this.getProtocolConfig()
      })
    } catch (error) {
      Toast.info(error)
    }
  }

  getProtocolConfig = async () => {
    try {
      order.getProtocolConfig({ class_id: this.state.class_id }).then(res => {
        this.setState({
          protocolConfig: res
        })
        
        if (res.province && res.province.length == 1) {
          this.setState({
            provinceArr: [res.province[0].Province]
          })
        }
      })
    } catch (error) {
      Toast.fail(e)
    }
  }

  // 提交
  PostUserInforSignup = () => {
    const { name, mobile, id_card, contract_id, class_pay_type, exam_card_code, provinceArr, isNeedSubmitProvince } = this.state
    if (!name) {
      Toast.info('请填写学员姓名')
      return
    }
    if (!mPattern.test(mobile)) {
      Toast.info('请填写正确的手机号')
      return
    }
    if (!cP.test(id_card) && !cP15.test(id_card)) {
      Toast.info('请填写正确的身份证号')
      return
    }
    if (class_pay_type == 2) {
      if (!exam_card_code) {
        Toast.info('请填写准考证号')
        return
      }else {
        if (!/^[A-Za-z0-9]+$/.test(exam_card_code) || exam_card_code == 0) {
          Toast.info('请填写正确的准考证号')
          return
        }
      }
    }
    if (isNeedSubmitProvince == 1 && provinceArr.length == 0) {
      Toast.info('请选择省份')
      return
    }
    if (contract_id) {
      Modal.alert('', '上一次签订的协议将被删除并在签订成功后生成新协议，确定重新签订？', [
        { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
        { text: '确定', onPress: () => this.signupFun() },
      ]);
    } else {
      this.signupFun()
    }
  }

  signupFun = async () => {
    const { name, mobile, id_card, class_id, template_id, exam_card_code, provinceArr, back_type, order_no, order_id } = this.state
    // 进入泛微认证
    const params = {
      template_id,
      class_id,
      id_card,
      mobile,
      name,
      username: getCookie('UserName'),
      back_type,
      exam_card_code,
      province: provinceArr[0],
      order_no,
      order_id
    }
    try {
      const data = await order.personalIdentify(params)
      window.location.href = data.auth_url
    } catch (error) {
      Toast.info(error)
    }
  }

  render() {
    const { protocolConfig, name, mobile, id_card, class_pay_type, contract_id, exam_card_code, provinceArr, isNeedSubmitProvince } = this.state
    const provinceData = (protocolConfig.province || []).map(item => {
      return {
        label: item.Province,
        value: item.Province
      }
    })
    return (
      <div id={card.userInfor}>
        <List>
          <InputItem
            type="text"
            placeholder="必填"
            onChange={e => {
              this.setState({ name: e })
            }}
            value={name}
            clear
          >
            学员姓名
          </InputItem>
          <InputItem
            type="number"
            placeholder="必填"
            onChange={e => {
              this.setState({ mobile: e })
            }}
            value={mobile}
            clear
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          >
            手机号码
          </InputItem>
          <InputItem
            type="text"
            placeholder="必填"
            onChange={e => {
              this.setState({ id_card: e })
            }}
            value={id_card}
            clear
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          >
            身份证号
          </InputItem>
          {
            isNeedSubmitProvince == 1 ? (
              provinceData.length == 1 ? (
                <InputItem
                  type="text"
                  value={provinceArr[0]}
                  disabled
                >
                  考试省份
                </InputItem>
              ) : (
                <Picker
                extra="请选择"
                data={provinceData}
                cols={1}
                title="省份选择"
                value={provinceArr}
                onOk={e => {
                  this.setState({ provinceArr: e })
                }}
                onDismiss={e => console.log('dismiss', e)}
                itemStyle={{ fontSize: '16px' }}
              >
                <List.Item arrow="horizontal">考试省份</List.Item>
              </Picker>
              )
            ) : ''
          }
          {
            class_pay_type == 2 ? (
              <InputItem
                type="text"
                placeholder="必填"
                onChange={e => {
                  this.setState({ exam_card_code: e })
                }}
                value={exam_card_code}
                clear
                moneyKeyboardWrapProps={moneyKeyboardWrapProps}
              >
                准考证号
              </InputItem>
            ) : null
          }
        </List>
        <p className={`${card.xy} f24`}>
          <i className="iconfont iconxingzhuangx f32" />
          已同意签订{' '}
          <span
            onClick={() => {
              window.location.href = protocolConfig.protocolH5Url
            }}
          >
            <span className={`f32`}>&laquo;</span>
            {protocolConfig.protocolName}
            <span className={`f32`}>&raquo;</span>
          </span>
        </p>
        {
          <button
            className={`${card.submitBtn} f36`}
            onClick={this.PostUserInforSignup}
          >
            {contract_id ? '重新签订' : '签订协议'}
          </button>
        }
        <p className={`${card.xyTip} f26`}>
          <span className={card.protocolTipText}>{protocolConfig.notice}</span>
        </p>
      </div>
    )
  }
}

export default withRouter(connect()(UserInforCard))
