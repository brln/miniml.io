import React, { PureComponent } from 'react'
import {connect} from "react-redux"
import functional from '../actions/functional'
import MessageListing from '../components/Messages/MessageListing'
import { List } from 'immutable'

import {
  clearSelected,
  deselectItem,
  selectItem,
  setEmailPage,
  toggleShowRead,
} from '../actions/standard'
import { MainBox } from '../components/Shared/MainBox'
import { EMAILS, RSS_ARTICLES, TWEETS } from "../constants/magicStrings"

class Messages extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectAllChecked: false
    }
    this.deselectAll = this.deselectAll.bind(this)
    this.markRead = this.markRead.bind(this)
    this.markUnread = this.markUnread.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.openItem = this.openItem.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.selectAllEmails = this.selectAllEmails.bind(this)
    this.selectItem = this.selectItem.bind(this)
    this.toggleSelectAll = this.toggleSelectAll.bind(this)
    this.showReadToggle = this.showReadToggle.bind(this)
  }

  selectItem (type, id) {
    return () => {
      if ((this.props.selectedItems.get(type) || List()).includes(id)) {
        this.props.dispatch(deselectItem(type, [id]))
      } else {
        this.props.dispatch(selectItem(type, [id]))
      }
    }
  }

  selectAllEmails () {
    this.props.dispatch(selectItem(EMAILS, this.props.emails.keySeq().toList()))
    this.props.dispatch(selectItem(RSS_ARTICLES, this.props.articles.keySeq().toList()))
    this.props.dispatch(selectItem(TWEETS, this.props.tweets.keySeq().toList()))
  }

  deselectAll () {
    this.props.dispatch(clearSelected())
  }

  async markRead () {
    await this.props.dispatch(functional.bulkUpdateSelectedEmails({read: true}, this.props.emailPage))
    await this.props.dispatch(functional.bulkUpdateSelectedRssArticles({read: true}, this.props.emailPage))
    await this.props.dispatch(functional.bulkUpdateSelectedTweets({read: true}, this.props.emailPage))
    this.deselectAll()
    this.setState({
      selectAllChecked: false
    })
  }

  openItem (type, id) {
    this.props.dispatch(functional.openInboxItem(type, id))
  }

  async markUnread () {
    await this.props.dispatch(functional.bulkUpdateSelectedEmails({read: false}, this.props.emailPage))
    await this.props.dispatch(functional.bulkUpdateSelectedRssArticles({read: false}, this.props.emailPage))
    await this.props.dispatch(functional.bulkUpdateSelectedTweets({read: false}, this.props.emailPage))
    this.deselectAll()
    this.setState({
      selectAllChecked: false
    })
  }

  nextPage () {
    this.props.dispatch(setEmailPage(this.props.emailPage + 1))
    this.setState({
      selectAllChecked: false
    })
    this.deselectAll()
    this.props.dispatch(functional.loadInbox())
  }

  previousPage () {
    if (this.props.emailPage > 0) {
      this.props.dispatch(setEmailPage(this.props.emailPage - 1))
      this.setState({
        selectAllChecked: false
      })
      this.deselectAll()
      this.props.dispatch(functional.loadInbox())
    }
  }

  toggleSelectAll (e) {
    if (!this.state.selectAllChecked) {
      this.setState({
        selectAllChecked: true
      })
      this.selectAllEmails()
    } else {
      this.setState({
        selectAllChecked: false
      })
      this.deselectAll()
    }
  }

  showReadToggle () {
    this.props.dispatch(toggleShowRead())
  }

  render () {
    console.log(this.props.tweets.toJS())
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
          selectAllChecked={this.state.selectAllChecked}
          selectedItems={this.props.selectedItems}
          selectItem={this.selectItem}
          showReadToggle={this.showReadToggle}
          showRead={this.props.showRead}
          tweets={this.props.tweets}
          toggleEmailRead={this.toggleEmailRead}
          toggleSelectAll={this.toggleSelectAll}
        />
      </MainBox>
    )
  }
}

function mapStateToProps (state) {
  console.log(state.getIn(['localState', 'selectedItems']).toJS())
  return {
    articles: state.getIn(['localState', 'articles']),
    emails: state.getIn(['localState', 'emails']),
    emailPage: state.getIn(['localState', 'emailPage']),
    inboxItems: state.getIn(['localState', 'inboxItems']),
    inboxLoading: state.getIn(['localState', 'inboxLoading']),
    rssFeeds: state.getIn(['localState', 'rssFeeds']),
    selectedItems: state.getIn(['localState', 'selectedItems']),
    showRead: state.getIn(['localState', 'showRead']),
    tweets: state.getIn(['localState', 'tweets'])
  }
}

export default connect(mapStateToProps)(Messages)
