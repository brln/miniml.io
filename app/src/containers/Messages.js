import React, { PureComponent } from 'react'
import {connect} from "react-redux"

class Messages extends PureComponent {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <div>
        <h1>Yep, Messages</h1>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {}
}

export default connect(mapStateToProps)(Messages)
