import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import styled from 'styled-components'


const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex: 1;
`

const Row = styled.div`
  display: flex;
  border: 1px solid black;
  padding: 0.5em;
  margin: 0.2em;
`

const MarkReadBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5em;
  justify-content: center;
`

const Subject = styled.div`
  font-size: 130%;
  color: ${p => p.read ? 'grey' : 'black'};
`

const From = styled.div`
  font-size: 130%;
  color: ${p => p.read ? 'grey' : 'black'};
`

const PrettyLink = styled(Link)`
  text-decoration: none;
`

const DateBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

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
            onChange={this.props.toggleEmailRead(this.props.email.get('id'))}
            checked={this.props.email.get('read')}
          />
        </MarkReadBox>
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
