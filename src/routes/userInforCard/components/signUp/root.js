import { connect } from 'dva'
import React, { Component } from 'react'
import { withRouter } from 'dva/router'
import { Toast } from 'antd-mobile';
import card from '../../userInforCard.less'
import Inputs from '../Inputs/root'
import { GetUserInforSignup } from '../../../../services/cardService'
import validator from '../../validator'

class SignUp extends Component {
  state = {
    protocolId: '',
    rid: '',
    isEdit: false,
    inforMap: [
      { label: '学员姓名', key: 'StudentName' },
      { label: '性别', key: 'sex' },
      { label: '手机号码', key: 'TelNo' },
      { label: '身份证号', key: 'IdCard' },
      // { label: '针对考试', key: 'forExam' },
      // { label: '准考证号', key: 'ExamCertifacteNo' },
      // { label: '退费银行', key: 'FeeBank' },
      // { label: '银行户名', key: 'FeeAccountName' },
      // { label: '银行账号', key: 'FeeAccountNo' }
    ]
  }

  componentDidMount() {
    const { location } = this.props
    const search = qs.parse(location.search)
    const { triggerRef } = this.props
    triggerRef(this)

    this.setState({ ...search }, () => {
      // eslint-disable-next-line react/destructuring-assignment
      if (this.state.rid) this.asyncValidatorDefaults()
    })
  }

  validateFields = () => [this.inputs.validateFields()]

  otherFields = () => this.inputs.otherFields()

  // 编辑
  asyncValidatorDefaults = async () => {
    try {
      const { inforMap, protocolId } = this.state
      const data = await GetUserInforSignup({
        userName: getCookie('UserName') || 'app_ztk817878886',
        protocolId
      })

      this.setState(
        {
          inforMap: [
            ...inforMap.map(infor => {
              const { key, label } = infor
              const isSelect = validator[label].select
              const initialValue = isSelect ? [data[key]] : data[key] // select initialValue 应该赋值数组

              if (key in data) {
                infor = { ...infor, defaults: { initialValue } }
              }
              return infor
            })
          ]
        },
        () => {
          this.setState({
            isEdit: true
          })
        }
      )
    } catch (e) {
      Toast.fail(e)
    }
  }

  render() {
    const { inforMap, isEdit } = this.state

    return (
      <div id={card.signUp}>
        <Inputs
          triggerRef={ref => {
            this.inputs = ref
          }}
          inforMap={inforMap}
          isEdit={isEdit}
        />
      </div>
    )
  }
}

export default withRouter(connect()(SignUp))
