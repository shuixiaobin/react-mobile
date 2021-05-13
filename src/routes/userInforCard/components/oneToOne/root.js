import { connect } from 'dva'
import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import { withRouter } from 'dva/router'
import card from '../../userInforCard.less'
import Inputs from '../Inputs/root'
import { GetUserInforoto } from '../../../../services/javaApi'
import validator from '../../validator'

class OneToOne extends Component {
  state = {
    rid: '',
    OrderNum: '',
    oneToOne: '', // 一对一信息表 1：未填写 2：已填写
    isEdit: false,
    inforMap: [
      { label: '学员姓名', key: 'UserReName' },
      { label: '性别', key: 'Sex' },
      { label: '学历', key: 'Edu' },
      { label: '专业', key: 'major' },
      { label: '手机号码', key: 'Telephone' },
      { label: '课程名称', key: 'NetClassName' },
      { label: '相关考试经历', key: 'ExamExperience' },
      { label: '报考学段', key: 'stage' },
      { label: '报考科目', key: 'subject' },
      { label: '报考地区', key: 'area' },
      { label: '可上课时间段', key: 'classTime' }
    ]
  }

  componentDidMount() {
    const { location } = this.props
    const search = qs.parse(location.search)
    const { triggerRef } = this.props

    triggerRef(this)
    this.setState({ ...search }, () => {
      this.setNetClassName(search)
      // eslint-disable-next-line react/destructuring-assignment
      if (this.state.oneToOne == 2) this.asyncValidatorDefaults()
    })
  }

  validateFields = () => [this.inputs.validateFields()]

  otherFields = () => this.inputs.otherFields()

  // 编辑
  asyncValidatorDefaults = async () => {
    try {
      const { inforMap, OrderNum, rid } = this.state
      const data = await GetUserInforoto({
        OrderNum,
        rid
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
          this.setState({ isEdit: true })
        }
      )
    } catch (e) {
      Toast.fail(e)
    }
  }

  // 课程名称
  setNetClassName = search => {
    if (search && search.NetClassName) {
      const { inforMap } = this.state

      this.setState({
        inforMap: [
          ...inforMap.map(infor => {
            if (infor.key === 'NetClassName') {
              infor = {
                ...infor,
                defaults: { initialValue: decodeURI(search.NetClassName) }
              }
            }

            return infor
          })
        ]
      })
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
          isOneToOne
          isEdit={isEdit}
        />
      </div>
    )
  }
}

export default withRouter(connect()(OneToOne))
