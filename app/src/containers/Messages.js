import React, { PureComponent } from 'react'
import {connect} from "react-redux"
import functional from '../actions/functional'
import Emails from '../components/Messages/Emails'
import styled from "styled-components"
import {clearSelectedEmails, deselectEmails, selectEmails, setEmailPage} from '../actions/standard'




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
    this.state = {
      selectAllEmailsChecked: false
    }
    this.deselectAllEmails = this.deselectAllEmails.bind(this)
    this.markRead = this.markRead.bind(this)
    this.markUnread = this.markUnread.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.selectAllEmails = this.selectAllEmails.bind(this)
    this.selectEmail = this.selectEmail.bind(this)
    this.toggleSelectAll = this.toggleSelectAll.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(functional.getEmails(0))
  }

  selectEmail(id) {
    return () => {
      if (this.props.selectedEmails.includes(id)) {
        this.props.dispatch(deselectEmails([id]))
      } else {
        this.props.dispatch(selectEmails([id]))
      }
    }
  }

  selectAllEmails () {
    this.props.dispatch(selectEmails(this.props.emails.keySeq().toList()))
  }

  deselectAllEmails () {
    this.props.dispatch(clearSelectedEmails())
  }

  markRead () {
    this.props.dispatch(functional.bulkUpdateSelectedEmails({read: true})).then(() => {
      this.props.dispatch(clearSelectedEmails())
      this.setState({
        selectAllEmailsChecked: false
      })
    })
  }

  markUnread () {
    this.props.dispatch(functional.bulkUpdateSelectedEmails({read: false})).then(() => {
      this.props.dispatch(clearSelectedEmails())
      this.setState({
        selectAllEmailsChecked: false
      })
    })
  }

  nextPage () {
    const nextPage = this.props.emailPage + EMAILS_PER_PAGE
    this.props.dispatch(functional.getEmails(nextPage)).then(() => {
      this.setState({
        selectAllEmailsChecked: false
      })
      this.deselectAllEmails()
      this.props.dispatch(setEmailPage(nextPage))
    })
  }

  previousPage () {
    if (this.props.emailPage > 0) {
      const nextPage = this.props.emailPage - EMAILS_PER_PAGE
      this.props.dispatch(functional.getEmails(nextPage)).then(() => {
        this.setState({
          selectAllEmailsChecked: false
        })
        this.deselectAllEmails()
        this.props.dispatch(setEmailPage(nextPage))
      })
    }
  }

  toggleSelectAll (e) {
    if (e.target.checked) {
      this.setState({
        selectAllEmailsChecked: true
      })
      this.selectAllEmails()
    } else {
      this.setState({
        selectAllEmailsChecked: false
      })
      this.deselectAllEmails()
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
          markRead={this.markRead}
          markUnread={this.markUnread}
          nextPage={this.nextPage}
          previousPage={this.previousPage}
          selectAllEmailsChecked={this.state.selectAllEmailsChecked}
          selectEmail={this.selectEmail}
          selectedEmails={this.props.selectedEmails}
          toggleEmailRead={this.toggleEmailRead}
          toggleSelectAll={this.toggleSelectAll}
        />
      </MainBox>
    )
  }
}

function mapStateToProps (state) {
  return {
    emails: state.getIn(['localState', 'emails']),
    emailPage: state.getIn(['localState', 'emailPage']),
    selectedEmails: state.getIn(['localState', 'selectedEmails'])
  }
}

export default connect(mapStateToProps)(Messages)
