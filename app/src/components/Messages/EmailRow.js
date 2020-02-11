import React from 'react'
import moment from 'moment'
import { FaEnvelope } from 'react-icons/fa'

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

export default class EmailRow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onLinkClick = this.onLinkClick.bind(this)
  }

  onLinkClick () {
    this.props.openItem('email', this.props.email.get('id'))
  }

  render () {
    if (this.props.showRead || !this.props.email.get('read')) {
      return (
        <Row>
          <MarkReadBox>
            <input
              type="checkbox"
              onChange={this.props.selectEmail(this.props.email.get('id'))}
              checked={this.props.checked}
            />
          </MarkReadBox>
          <IconBox>
            <FaEnvelope />
          </IconBox>
          <HeaderInfo>
            <PrettyLink
              onClick={this.onLinkClick}
              style={{color: 'black'}}
            >
              <Subject read={this.props.email.get('read')}>{ this.props.email.get('subject') }</Subject>
              <From read={this.props.email.get('read')}>{ this.props.email.get('fromAddress')}</From>
            </PrettyLink>
          </HeaderInfo>
          <DateBox>
            <RowDate date={this.props.email.get('date')} />
          </DateBox>
        </Row>
      )
    } else {
      return null
    }
  }
}
