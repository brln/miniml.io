import React from 'react'
import { FaRedditSquare, FaRssSquare } from 'react-icons/fa'

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
    this.onLinkClick = this.onLinkClick.bind(this)
  }

  onLinkClick () {
    this.props.openItem('rssArticle', this.props.article.get('id'))
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
            { source.get('specialType') === 'reddit' ? <FaRedditSquare /> : <FaRssSquare />}
          </IconBox>
          <HeaderInfo>
            <PrettyLink
              onClick={this.onLinkClick}
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
