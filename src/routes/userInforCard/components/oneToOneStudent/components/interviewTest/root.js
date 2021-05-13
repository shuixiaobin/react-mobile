import { connect } from 'dva'
import React, { Component } from 'react'
import card from '../../../../userInforCard.less'
import Inputs from '../../../Inputs/root'

// 面试
class InterViewTest extends Component {
  state = {
    inforMap: [
      { label: '年龄', key: 'Age' },
      { label: '面试时间', key: 'Examtime' },
      { label: '面试比例', key: 'ViewRatio' }
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

export default connect()(InterViewTest)
