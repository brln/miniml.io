import React, { PureComponent } from 'react'
import {connect} from "react-redux"
import functional from '../actions/functional'
import MessageListing from '../components/Messages/MessageListing'

import {
  clearSelectedEmails,
  deselectEmails,
  selectEmails,
  setEmailPage
} from '../actions/standard'
import { MainBox } from '../components/Shared/MainBox'

class Messages extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectAllEmailsChecked: false
    }
    this.deselectAllEmails = this.deselectAllEmails.bind(this)
    this.markArchived = this.markArchived.bind(this)
    this.markRead = this.markRead.bind(this)
    this.markUnread = this.markUnread.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.selectAllEmails = this.selectAllEmails.bind(this)
    this.selectEmail = this.selectEmail.bind(this)
    this.toggleSelectAll = this.toggleSelectAll.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(functional.getEmails(this.props.emailPage))
    this.props.dispatch(functional.getArticles(this.props.emailPage))
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
    this.props.dispatch(functional.bulkUpdateSelectedEmails({read: true}, this.props.emailPage)).then(() => {
      this.props.dispatch(clearSelectedEmails())
      this.setState({
        selectAllEmailsChecked: false
      })
    })
  }

  markArchived () {
    this.props.dispatch(functional.bulkUpdateSelectedEmails({archived: true}, this.props.emailPage)).then(() => {
      this.props.dispatch(clearSelectedEmails())
      this.setState({
        selectAllEmailsChecked: false
      })
    })
  }

  markUnread () {
    this.props.dispatch(functional.bulkUpdateSelectedEmails({read: false}, this.props.emailPage)).then(() => {
      this.props.dispatch(clearSelectedEmails())
      this.setState({
        selectAllEmailsChecked: false
      })
    })
  }

  nextPage () {
    const nextPage = this.props.emailPage + 1
    this.props.dispatch(functional.getEmails(nextPage)).then(() => {
      return this.props.dispatch(functional.getArticles(nextPage))
    }).then(() => {
      this.setState({
        selectAllEmailsChecked: false
      })
      this.deselectAllEmails()
      this.props.dispatch(setEmailPage(nextPage))
    })
  }

  previousPage () {
    if (this.props.emailPage > 0) {
      const nextPage = this.props.emailPage - 1
      this.props.dispatch(functional.getEmails(nextPage)).then(() => {
        return this.props.dispatch(functional.getArticles(nextPage))
      }).then(() => {
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
    return (
      <MainBox>
        <MessageListing
          articles={this.props.articles}
          emails={this.props.emails}
          emailPage={this.props.emailPage}
          markArchived={this.markArchived}
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
    articles: state.getIn(['localState', 'articles']),
    emails: state.getIn(['localState', 'emails']),
    emailPage: state.getIn(['localState', 'emailPage']),
    selectedEmails: state.getIn(['localState', 'selectedEmails'])
  }
}

export default connect(mapStateToProps)(Messages)
