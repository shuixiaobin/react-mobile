import React from 'react'
import { connect } from 'dva'
import Activity from '@/routes/classDetail/components/Activity'
import detail from '../../detail.less'

class ActivityModel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const { dispatch, classId } = this.props

    dispatch({
      type: 'classDetail/getActivityList',
      payload: {
        classId
      }
    })
  }

  render() {
    return (
      <div className={detail.activity}>
        <Activity />
      </div>
    )
  }
}

export default connect()(ActivityModel)
