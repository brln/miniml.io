import React from 'react'
import moment from 'moment'
import { FaTwitterSquare } from 'react-icons/fa'

import {
  MarkReadBox,
  HeaderInfo,
  IconBox,
  Row,
  PrettyLink,
  Subject,
  From,
  DateBox,
} from './StyledComponents'
import RowDate from './RowDate'
import {TWEETS} from "../../constants/magicStrings"

export default class TweetRow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onLinkClick = this.onLinkClick.bind(this)
  }

  onLinkClick () {
    this.props.openItem('tweet', this.props.tweet.get('id'))
  }

  render () {
    const read = this.props.tweet.getIn(['UserTweet', 'read'])
    console.log('***', read)
    if (this.props.showRead || !read) {
      return (
        <Row>
          <MarkReadBox>
            <input
              type="checkbox"
              onChange={this.props.selectItem(TWEETS, this.props.tweet.get('id'))}
              checked={this.props.checked}
            />
          </MarkReadBox>
          <IconBox>
            <FaTwitterSquare />
          </IconBox>
          <HeaderInfo>
            <PrettyLink
              onClick={this.onLinkClick}
              style={{color: 'black'}}
            >
              <Subject read={read}>{ this.props.tweet.get('text') }</Subject>
              <From read={read}>{ this.props.tweet.getIn(['TwitterUser', 'name'])}</From>
            </PrettyLink>
          </HeaderInfo>
          <DateBox>
            <RowDate date={this.props.tweet.get('createdAt')} />
          </DateBox>
        </Row>
      )
    } else {
      return null
    }
  }
}
