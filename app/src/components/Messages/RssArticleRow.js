import React from 'react'
import moment from 'moment'
import { FaRssSquare } from 'react-icons/fa'

import {
  IconBox,
  MarkReadBox,
  HeaderInfo,
  Row,
  PrettyLink,
  Subject,
  DateBox,
  From,
} from './StyledComponents'
import RowDate from './RowDate'

export default class RssArticleRow extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render () {
    const read = this.props.article.getIn(['RssArticleUsers', 0, 'read'])
    const source = this.props.rssFeeds.get(this.props.article.get('rssFeedID'))

    if (this.props.showRead || !read) {
      return (
        <Row>
          <MarkReadBox>
            <input
              type="checkbox"
              onChange={this.props.selectRssArticle(this.props.article.get('id'))}
              checked={this.props.checked}
            />
          </MarkReadBox>
          <IconBox>
            <FaRssSquare />
          </IconBox>
          <HeaderInfo>
            <PrettyLink
              to={`/messages/articles/${this.props.article.get('id')}`}
              style={{color: 'black'}}
            >
              <Subject read={read}>{ this.props.article.get('title') }</Subject>
              <From read={read}>{ source ? source.get('title') : ''}</From>
            </PrettyLink>
          </HeaderInfo>
          <DateBox>
            <RowDate date={this.props.article.get('pubDate')} />
          </DateBox>
        </Row>
      )
    } else {
      return null
    }
  }
}
