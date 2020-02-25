import React from 'react'
import {connect} from "react-redux"
import styled from "styled-components"
import FakeTweet from '../vendor/fake-tweet'
import '../vendor/fake-tweet.css'
import moment from 'moment'
import { Link } from 'react-router-dom'

import functional from '../actions/functional'
import { setViewingItem } from '../actions/standard'
import { MainBox } from '../components/Shared/MainBox'
import InboxItemShowPage from "./InboxItemShowPage"
import InboxItemPaginator from "../components/Shared/InboxItemPaginator"

const MessageBox = styled.div`
  border: 1px solid black;
`

class Tweet extends InboxItemShowPage {
  constructor(props) {
    super(props)
    this.state = {}
    this.backDisabled = this.backDisabled.bind(this)
    this.forwardDisabled = this.forwardDisabled.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.changePage = this.changePage.bind(this)
    this.nextItem = this.nextItem.bind(this)
  }

  static getDerivedStateFromProps (props, state) {
    if (props.tweet && props.tweet.get('id') !== props.itemID) {
      props.dispatch(setViewingItem(props.tweets.get(props.itemID)))
    }
    return state
  }

  componentDidMount () {
    if (!this.props.tweet) {
      this.props.dispatch(functional.getTweet(this.props.itemID)).then(() => {
        this.props.dispatch(functional.toggleTweetRead(this.props.itemID))
      })
    } else if (this.props.tweet.get('id') !== this.props.itemID) {
      this.props.dispatch(setViewingItem(this.props.tweets.get(this.props.itemID)))
    }
  }

  render () {
    if (this.props.tweet) {
      return (

        <MainBox>
          <InboxItemPaginator
            forwardDisabled={this.forwardDisabled()}
            backDisabled={this.backDisabled()}
            nextPage={this.nextPage}
            previousPage={this.previousPage}
          />

          <div>
            <a href={`https://twitter.com/i/web/status/${this.props.tweet.get('id')}`} target={"_blank"}>
            <img src={ this.props.tweet.get('imageURL')} />
            <FakeTweet config={
              {
                user: {
                  nickname: this.props.tweet.getIn(['TwitterUser', 'screenName']),
                  name: this.props.tweet.getIn(['TwitterUser', 'name']),
                  avatar: this.props.tweet.getIn(['TwitterUser', 'profileImageUrlHttps']),
                  verified: this.props.tweet.getIn(['TwitterUser', 'verified']),
                  locked: false
                },
                nightMode: false,
                text: this.props.tweet.get('text'),
                image: "",
                date: moment(this.props.tweet.get('createdAt')).format('LLL'),
                app: this.props.tweet.get('source'),
                retweets: this.props.tweet.get('retweetCount'),
                likes: this.props.tweet.get('favoriteCount')
              }
            }/>
            </a>
          </div>
        </MainBox>
      )
    } else {
      return 'Loading...'
    }
  }
}

function mapStateToProps (state, passedProps) {
  const tweetID = passedProps.match.params.id
  return {
    articles: state.getIn(['localState', 'articles']),
    emails: state.getIn(['localState', 'emails']),
    tweet: state.getIn(['localState', 'viewingItem']),
    tweetID,
    inboxItems: state.getIn(['localState', 'inboxItems']),
    itemID: tweetID,
    tweets: state.getIn(['localState', 'tweets'])
  }
}

export default connect(mapStateToProps)(Tweet)
