import React, { PureComponent } from 'react'
import {connect} from "react-redux"
import styled from "styled-components"
import functional from '../actions/functional'

const MainBox = styled.div`
  top: 1em;
  left: 1em;
  background: #FFFFFF;
  max-width: 600px;
  display: flex;
  flex-direction: column;
`

const MessageBox = styled.div`
  border: 1px solid black;
`

class Email extends PureComponent {
  constructor(props) {
    super(props)
    this.toggleRead = this.toggleRead.bind(this)
  }

  toggleRead () {
    if (!this.props.email.get('read')) {
      this.props.dispatch(functional.toggleEmailRead(this.props.email.get('id')))
    }
  }

  componentDidMount () {
    if (!this.props.email) {
      this.props.dispatch(functional.getEmail(this.props.emailID)).then(() => {
        this.toggleRead()
      })
    } else {
      this.toggleRead()
    }
  }

  render () {
    if (this.props.email) {
      return (
        <MainBox>
          <div>
            From: {this.props.email.get('fromAddress')}
          </div>

          <div>
            To: @{this.props.email.get('userID')}
          </div>

          <div>
            Subject: {this.props.email.get('subject')}
          </div>

          <MessageBox>
            <div dangerouslySetInnerHTML={{ __html: this.props.email.get('bodyHTML')}} />
          </MessageBox>


        </MainBox>
      )
    } else {
      return 'Loading...'
    }
  }
}

function mapStateToProps (state, passedProps) {
  const emailID = passedProps.match.params.id
  return {
    email: state.getIn(['localState', 'emails', emailID]),
    emailID,
  }
}

export default connect(mapStateToProps)(Email)
