import React from 'react'
import { Link } from 'react-router-dom'

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
`

export default class EmailRow extends React.Component {
  render () {
    return (
      <Row>
        <MarkReadBox>
          <input type="checkbox" />
        </MarkReadBox>
        <HeaderInfo>
          <Link to={`/messages/email/${this.props.email.get('id')}`}>
            <Subject>{ this.props.email.get('subject') }</Subject>
            <div>{ this.props.email.get('fromAddress')}</div>
          </Link>
        </HeaderInfo>
      </Row>

    )
  }
}
