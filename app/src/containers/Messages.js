import React, { PureComponent } from 'react'
import {connect} from "react-redux"
import functional from '../actions/functional'
import Emails from '../components/Messages/Emails'
import styled from "styled-components"
import {darkBrand} from "../colors"


const MainBox = styled.div`
  top: 1em;
  left: 1em;
  background: #FFFFFF;
  max-width: 600px;
  display: flex;
  flex-direction: column;
`

class Messages extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.dispatch(functional.getEmails())
  }

  render () {
    return (
      <MainBox>
        <Emails emails={this.props.emails.valueSeq()} />
      </MainBox>
    )
  }
}

function mapStateToProps (state) {
  return {
    emails: state.getIn(['localState', 'emails'])
  }
}

export default connect(mapStateToProps)(Messages)
