import React, { PureComponent } from 'react'
import {connect} from "react-redux"
import functional from '../actions/functional'
import Emails from '../components/Messages/Emails'
import styled from "styled-components"
import { setEmailPage } from '../actions/standard'


const MainBox = styled.div`
  top: 1em;
  left: 1em;
  background: #FFFFFF;
  max-width: 600px;
  display: flex;
  flex-direction: column;
`

const EMAILS_PER_PAGE = 50

class Messages extends PureComponent {
  constructor(props) {
    super(props)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.toggleEmailRead = this.toggleEmailRead.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(functional.getEmails(0))
  }

  toggleEmailRead(id) {
    return () => {
      this.props.dispatch(functional.toggleEmailRead(id))
    }
  }

  nextPage () {
    const nextPage = this.props.emailPage + EMAILS_PER_PAGE
    this.props.dispatch(functional.getEmails(nextPage)).then(() => {
      this.props.dispatch(setEmailPage(nextPage))
    })
  }

  previousPage () {
    if (this.props.emailPage > 0) {
      const nextPage = this.props.emailPage - EMAILS_PER_PAGE
      this.props.dispatch(functional.getEmails(nextPage)).then(() => {
        this.props.dispatch(setEmailPage(nextPage))
      })
    }
  }

  render () {
    const sortedEmails = this.props.emails.valueSeq().sort((a, b) => {
      return new Date(b.get('date')) - new Date(a.get('date'))
    })
    return (
      <MainBox>
        <Emails
          emails={sortedEmails}
          emailPage={this.props.emailPage}
          nextPage={this.nextPage}
          previousPage={this.previousPage}
          toggleEmailRead={this.toggleEmailRead}
        />
      </MainBox>
    )
  }
}

function mapStateToProps (state) {
  return {
    emails: state.getIn(['localState', 'emails']),
    emailPage: state.getIn(['localState', 'emailPage']),
  }
}

export default connect(mapStateToProps)(Messages)
