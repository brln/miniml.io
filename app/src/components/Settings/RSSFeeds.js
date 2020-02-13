import React, { PureComponent } from 'react'

import RssFeed from './RssFeed'

export default class RssFeeds extends PureComponent {
  render () {
    return (
      <>
        <h1>RSS Feeds</h1>
        { this.props.rssFeedAddError ? <div>{this.props.rssFeedAddError}</div> : null}
        <div>Add Feed: </div>
        <div>
          <input type="text" value={this.props.newFeed} onChange={this.props.updateNewFeed}/>
          <button onClick={this.props.submitNewFeed}>Add</button>
        </div>

        { this.props.rssFeeds.valueSeq().map(feed => {
          if (!feed.get('specialType')) {
            if (!feed.getIn(['RssFeedUser', 'deletedAt'])) {
              return (
                <RssFeed
                  deleteFeed={this.props.deleteFeed}
                  key={feed.get('id')}
                  feed={feed}
                />
              )
            }
          }
        })}
      </>
    )
  }
}
