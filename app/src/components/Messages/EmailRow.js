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

export default class EmailRow extends React.Component {
  constructor(props) {
    super(props)
    this.emailDate = this.emailDate.bind(this)
  }

  emailDate () {
    return moment(this.props.email.get('date')).format('lll')
  }

  render () {
    return (
      <Row>
        <MarkReadBox>
          <input
            type="checkbox"
            onChange={this.props.selectEmail(this.props.email.get('id'))}
            checked={this.props.selectedEmails.includes(this.props.email.get('id'))}
          />
        </MarkReadBox>
        <IconBox>
          <FaEnvelope />
        </IconBox>
        <HeaderInfo>
          <PrettyLink
            to={`/messages/email/${this.props.email.get('id')}`}
            style={{color: 'black'}}
          >
            <Subject read={this.props.email.get('read')}>{ this.props.email.get('subject') }</Subject>
            <From read={this.props.email.get('read')}>{ this.props.email.get('fromAddress')}</From>
          </PrettyLink>
        </HeaderInfo>
        <DateBox>
          {this.emailDate()}
        </DateBox>
      </Row>
    )
  }
}
