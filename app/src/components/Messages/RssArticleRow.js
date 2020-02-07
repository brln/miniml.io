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
} from './StyledComponents'

export default class RssArticleRow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.articleDate = this.articleDate.bind(this)
  }

  articleDate () {
    return moment(this.props.article.get('pubDate')).format('lll')
  }

  render () {
    const read = this.props.article.getIn(['RssArticleUsers', 0, 'read'])
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
            </PrettyLink>
          </HeaderInfo>
          <DateBox>
            {this.articleDate()}
          </DateBox>
        </Row>
      )
    } else {
      return null
    }
  }
}
