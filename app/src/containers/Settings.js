import React, { PureComponent } from 'react'
import {connect} from "react-redux"
import moment from 'moment'

import functional from '../actions/functional'
import { MainBox } from "../components/Shared/MainBox"


class Settings extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      newFeed: ''
    }
    this.submitNewFeed = this.submitNewFeed.bind(this)
    this.updateNewFeed = this.updateNewFeed.bind(this)
  }

  componentDidMount () {
    this.props.dispatch(functional.getRssFeeds())
  }

  updateNewFeed (e) {
    this.setState({
      newFeed: e.target.value
    })
  }

  submitNewFeed () {
    this.props.dispatch(functional.submitRssFeed(this.state.newFeed))
  }

  render () {
    return (
      <MainBox>
        <h1>RSS Feeds</h1>
        { this.props.rssFeedAddError ? <div>{this.props.rssFeedAddError}</div> : null}
        <div>Add Feed: </div>
        <div>
          <input type="text" value={this.state.newFeed} onChange={this.updateNewFeed}/>
          <button onClick={this.submitNewFeed}>Add</button>
        </div>

        <ul>
          { this.props.rssFeeds.valueSeq().map(feed => {
            return <li>{feed.get('title')}: {feed.get('description')}</li>
          })}
        </ul>
      </MainBox>
    )
  }
}

function mapStateToProps (state) {
  return {
    rssFeedAddError: state.getIn(['localState', 'rssFeedAddError']),
    rssFeeds: state.getIn(['localState', 'rssFeeds'])
  }
}

export default connect(mapStateToProps)(Settings)
