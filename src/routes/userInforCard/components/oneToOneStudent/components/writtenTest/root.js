import { connect } from 'dva'
import React, { Component } from 'react'
import card from '../../../../userInforCard.less'
import Inputs from '../../../Inputs/root'

// 笔试
class WrittenTest extends Component {
  state = {
    inforMap: [
      { label: '年龄', key: 'Age' },
      { label: '职位招聘人数', key: 'ApplyNum' },
      { label: '笔试时间', key: 'Examtime' }
    ]
  }

  componentDidMount() {
    const { triggerRef } = this.props

    triggerRef(this)
  }

  validateFields = () => this.inputs.validateFields()

  render() {
    const { inforMap } = this.state
    const { isEdit } = this.props

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

export default connect()(WrittenTest)
