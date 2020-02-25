import React from 'react'
import {connect} from "react-redux"
import functional from '../actions/functional'
import { MainBox } from '../components/Shared/MainBox'

import InboxItemShowPage from "./InboxItemShowPage"
import InboxItemPaginator from "../components/Shared/InboxItemPaginator"
import { setViewingItem } from "../actions/standard"


class RssArticle extends InboxItemShowPage {
  constructor(props) {
    super(props)
    this.backDisabled = this.backDisabled.bind(this)
    this.forwardDisabled = this.forwardDisabled.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.changePage = this.changePage.bind(this)
    this.nextItem = this.nextItem.bind(this)
  }

  static getDerivedStateFromProps (props, state) {
    if (props.article && props.article.get('id') !== props.articleID) {
      props.dispatch(setViewingItem(props.articles.get(props.articleID)))
    }
  }

  componentDidMount () {
    if (!this.props.article) {
      this.props.dispatch(functional.getRssArticle(this.props.articleID)).then(() => {
        this.props.dispatch(functional.toggleRssArticleRead(this.props.article.get('id')))
      })
    }
  }

  render () {
    if (this.props.article) {
      return (
        <MainBox>
          <InboxItemPaginator
            forwardDisabled={this.forwardDisabled()}
            backDisabled={this.backDisabled()}
            nextPage={this.nextPage}
            previousPage={this.previousPage}
          />
          <h2>
            <a style={{color: 'black'}} target="_blank" rel="noopener noreferrer" href={this.props.article.get('link')}>{ this.props.article.get('title') }</a>
          </h2>
          <h3>{ this.props.rssFeeds.getIn([this.props.article.get('rssFeedID'), 'title'])}</h3>
          <h4>{ this.props.article.get('author') }</h4>
          <div style={{fontFamily: 'serif'}} dangerouslySetInnerHTML={{ __html: this.props.article.get('content')}} />
        </MainBox>
      )
    } else {
      return 'Loading...'
    }
  }
}

function mapStateToProps (state, passedProps) {
  const articleID = passedProps.match.params.id
  return {
    article: state.getIn(['localState', 'viewingItem']),
    articleID,
    articles: state.getIn(['localState', 'articles']),
    emails: state.getIn(['localState', 'emails']),
    rssFeeds: state.getIn(['localState', 'rssFeeds']),
    inboxItems: state.getIn(['localState', 'inboxItems']),
    itemID: articleID,
    tweets: state.getIn(['localState', 'tweets'])
  }
}

export default connect(mapStateToProps)(RssArticle)
