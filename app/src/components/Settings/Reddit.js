import React, { PureComponent } from 'react'

import RssFeed from './RssFeed'

export default class Reddit extends PureComponent {
  render () {
    return (
      <>
        <h1>Reddit</h1>
        <div>Add Subreddit: </div>
        <div>
          <input type="text" value={this.props.newReddit} onChange={this.props.updateNewReddit}/>
          <button onClick={this.props.submitNewReddit}>Add</button>
        </div>

        { this.props.rssFeeds.filter(f => f.get('specialType') === 'reddit').valueSeq().map(feed => {
          if (!feed.getIn(['RssFeedUser', 'deletedAt'])) {
            return (
              <RssFeed
                deleteFeed={this.props.deleteFeed}
                key={feed.get('id')}
                feed={feed}
              />
            )
          }
        })}
      </>
    )
  }
}
