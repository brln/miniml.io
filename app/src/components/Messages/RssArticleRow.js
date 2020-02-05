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

export default class RssArticleRow extends React.Component {
  constructor(props) {
    super(props)
    this.articleDate = this.articleDate.bind(this)
  }

  articleDate () {
    return moment(this.props.article.get('pubDate')).format('lll')
  }

  render () {
    return (
      <Row>
        <MarkReadBox>
          <input
            type="checkbox"
            onChange={() => {}}
            checked={false}
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
            <Subject read={this.props.article.get('read')}>{ this.props.article.get('title') }</Subject>
          </PrettyLink>
        </HeaderInfo>
        <DateBox>
          {this.articleDate()}
        </DateBox>
      </Row>
    )
  }
}
