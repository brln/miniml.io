import React, { PureComponent } from 'react'
import functional from "../actions/functional"

export default class InboxItemShowPage extends PureComponent {
  forwardDisabled () {
    const nextItem = this.nextItem(x => x + 1)
    return !nextItem || this.isNextRead(nextItem)
  }

  backDisabled () {
    const currentIndex = this.props.inboxItems.findIndex(i => i.get('id') === this.props.itemID)
    const next = this.nextItem(x => x - 1)
    if (next) {
      const nextIndex = this.props.inboxItems.findIndex(i => i.get('id') === next.get('id'))
      return nextIndex > currentIndex
    } else {
      return true
    }
  }

  isNextRead (nextItem)  {
    let nextRead = false
    if (nextItem && nextItem.get('type') === 'rssArticle') {
      nextRead = this.props.articles.getIn([nextItem.get('id'), 'RssArticleUsers', 0, 'read'])
    } else if (nextItem && nextItem.get('type') === 'email') {
      nextRead = this.props.emails.getIn([nextItem.get('id'), 'read'])
    }
    return nextRead
  }

  nextItem (iterate) {
    let item = this.props.inboxItems.findIndex(i => i.get('id') === this.props.itemID)
    let nextIndex = iterate(item)
    let nextItem = this.props.inboxItems.get(nextIndex)

    while (this.isNextRead(nextItem)) {
      nextIndex = iterate(nextIndex)
      nextItem = this.props.inboxItems.get(nextIndex)
    }
    return nextItem
  }

  changePage (iterate) {
    const nextItem = this.nextItem(iterate)
    this.props.dispatch(functional.openInboxItem(nextItem.get('type'), nextItem.get('id')))
  }

  nextPage () {
    this.changePage(x => x + 1)
  }

  previousPage () {
    this.changePage(x => x - 1)
  }
}
