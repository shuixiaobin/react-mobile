import { connect } from 'dva'
import React, { Component } from 'react'
import { withRouter } from 'dva/router'
import { Toast } from 'antd-mobile'
import card from '../../userInforCard.less'
import Inputs from '../Inputs/root'
import { GetUserInforoto } from '../../../../services/javaApi'
import WrittenTest from './components/writtenTest/root'
import InterviewTest from './components/interviewTest/root'
import validator from '../../validator'

class OneToOneStudent extends Component {
  state = {
    rid: '',
    OrderNum: '',
    oneToOne: '', // 一对一信息表 1：未填写 2：已填写
    isEdit: false,
    isWrittentest: true,
    inforMap: [
      { label: '学员姓名', key: 'UserReName' },
      { label: '性别', key: 'Sex' },
      { label: '学历', key: 'Edu' },
      { label: '手机号码', key: 'Telephone' },
      { label: 'QQ号', key: 'QQ' },
      { label: '课程名称', key: 'NetClassName' },
      { label: '考试类别', key: 'NetClassCategory' },
      { label: '考试经历', key: 'ExamExperience' },
      { label: '笔试面试', key: 'NetClassType' },
      { label: '报考职位', key: 'ApplyJobs' },
      { label: '额外要求', key: 'UserBz' }
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

  validateFields = () => {
    const { isWrittentest } = this.state
    const assignValidate = isWrittentest
      ? [this.WrittenTest.validateFields()]
      : [this.InterviewTest.validateFields(), this.scoreInputs.validateFields()]
    return [this.inputs.validateFields(), ...assignValidate]
  }

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

  getLabel = cur => {
    switch (cur.label) {
      case '笔试':
        this.setState({ isWrittentest: true })
        break
      case '面试':
        this.setState({ isWrittentest: false })
        break
      default:
        break
    }
  }

  render() {
    const { inforMap, isEdit, isWrittentest } = this.state

    return (
      <div id={card.signUp}>
        <Inputs
          triggerRef={ref => {
            this.inputs = ref
          }}
          inforMap={inforMap}
          isOneToOne
          isEdit={isEdit}
          getLabel={this.getLabel}
        />
        {isWrittentest ? null : (
          <Inputs
            triggerRef={ref => {
              this.scoreInputs = ref
            }}
            inforMap={[{ label: '分数和名次', key: 'score' }]}
            isOneToOne
            isEdit={isEdit}
            getLabel={this.getLabel}
          />
        )}
        <p className="f36">
          其他信息
          <span className="f26">选填</span>
        </p>
        {isWrittentest ? (
          <WrittenTest
            triggerRef={ref => {
              this.WrittenTest = ref
            }}
            isEdit={isEdit}
          />
        ) : (
          <InterviewTest
            triggerRef={ref => {
              this.InterviewTest = ref
            }}
            isEdit={isEdit}
          />
        )}
      </div>
    )
  }
}

export default withRouter(connect()(OneToOneStudent))
