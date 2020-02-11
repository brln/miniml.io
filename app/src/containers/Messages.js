import React, { PureComponent } from 'react'
import {connect} from "react-redux"
import functional from '../actions/functional'
import MessageListing from '../components/Messages/MessageListing'

import {
  clearSelectedEmails,
  clearSelectedRssArticles,
  deselectEmails,
  deselectRssArticle,
  selectEmails,
  selectRssArticle,
  setEmailPage,
  toggleShowRead,
} from '../actions/standard'
import { MainBox } from '../components/Shared/MainBox'

class Messages extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectAllEmailsChecked: false
    }
    this.deselectAll = this.deselectAll.bind(this)
    this.markRead = this.markRead.bind(this)
    this.markUnread = this.markUnread.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.openItem = this.openItem.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.selectAllEmails = this.selectAllEmails.bind(this)
    this.selectEmail = this.selectEmail.bind(this)
    this.selectRssArticle = this.selectRssArticle.bind(this)
    this.toggleSelectAll = this.toggleSelectAll.bind(this)
    this.showReadToggle = this.showReadToggle.bind(this)
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

  selectRssArticle (id) {
    return () => {
      if (this.props.selectedRssArticles.includes(id)) {
        this.props.dispatch(deselectRssArticle([id]))
      } else {
        this.props.dispatch(selectRssArticle([id]))
      }
    }
  }

  selectAllEmails () {
    this.props.dispatch(selectEmails(this.props.emails.keySeq().toList()))
    this.props.dispatch(selectRssArticle(this.props.articles.keySeq().toList()))
  }

  deselectAll () {
    this.props.dispatch(clearSelectedEmails())
    this.props.dispatch(clearSelectedRssArticles())
  }

  markRead () {
    this.props.dispatch(functional.bulkUpdateSelectedEmails({read: true}, this.props.emailPage)).then(() => {
      return this.props.dispatch(functional.bulkUpdateSelectedRssArticles({read: true}, this.props.emailPage))
    }).then(() => {
      this.deselectAll()
      this.setState({
        selectAllEmailsChecked: false
      })
    })
  }

  openItem (type, id) {
    this.props.dispatch(functional.openInboxItem(type, id))
  }

  markUnread () {
    this.props.dispatch(functional.bulkUpdateSelectedEmails({read: false}, this.props.emailPage)).then(() => {
      return this.props.dispatch(functional.bulkUpdateSelectedRssArticles({read: false}, this.props.emailPage))
    }).then(() => {
      this.deselectAll()
      this.setState({
        selectAllEmailsChecked: false
      })
    })
  }

  nextPage () {
    this.props.dispatch(setEmailPage(this.props.emailPage + 1))
    this.setState({
      selectAllEmailsChecked: false
    })
    this.deselectAll()
    this.props.dispatch(functional.loadInbox())
  }

  previousPage () {
    if (this.props.emailPage > 0) {
      this.props.dispatch(setEmailPage(this.props.emailPage - 1))
      this.setState({
        selectAllEmailsChecked: false
      })
      this.deselectAll()
      this.props.dispatch(functional.loadInbox())
    }
  }

  toggleSelectAll (e) {
    if (!this.state.selectAllEmailsChecked) {
      this.setState({
        selectAllEmailsChecked: true
      })
      this.selectAllEmails()
    } else {
      this.setState({
        selectAllEmailsChecked: false
      })
      this.deselectAll()
    }
  }

  showReadToggle () {
    this.props.dispatch(toggleShowRead())
  }

  render () {
    return (
      <MainBox>
        <MessageListing
          articles={this.props.articles}
          emails={this.props.emails}
          emailPage={this.props.emailPage}
          inboxItems={this.props.inboxItems}
          inboxLoading={this.props.inboxLoading}
          markRead={this.markRead}
          markUnread={this.markUnread}
          nextPage={this.nextPage}
          openItem={this.openItem}
          previousPage={this.previousPage}
          rssFeeds={this.props.rssFeeds}
          selectAllEmailsChecked={this.state.selectAllEmailsChecked}
          selectEmail={this.selectEmail}
          selectedEmails={this.props.selectedEmails}
          selectedRssArticles={this.props.selectedRssArticles}
          selectRssArticle={this.selectRssArticle}
          showReadToggle={this.showReadToggle}
          showRead={this.props.showRead}
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
    inboxItems: state.getIn(['localState', 'inboxItems']),
    inboxLoading: state.getIn(['localState', 'inboxLoading']),
    rssFeeds: state.getIn(['localState', 'rssFeeds']),
    selectedEmails: state.getIn(['localState', 'selectedEmails']),
    selectedRssArticles: state.getIn(['localState', 'selectedRssArticles']),
    showRead: state.getIn(['localState', 'showRead']),
  }
}

export default connect(mapStateToProps)(Messages)
