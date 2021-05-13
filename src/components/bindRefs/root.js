import React, { Component } from 'react'
import { connect } from 'dva'

function Bindrefs(Com) {
  return class Refs extends Component {
    state = {
      component: 'refs'
    }

    render() {
      const refs = React.createRef()
      return (
        <>
          <Com ref={refs} {...this.props} middleState={this.state} />
        </>
      )
    }
  }
}

export default connect()(Bindrefs)
