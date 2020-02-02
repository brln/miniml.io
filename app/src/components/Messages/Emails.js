import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

import EmailRow from './EmailRow'

const Paginator = styled.div`
  display: flex;
`

const PaginatorButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.3em;
  color: ${p => p.emailPage === 0 ? 'grey' : 'black'};
  cursor: ${p => p.emailPage === 0 ? '' : 'pointer'};
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
`

const Button = styled.div`
  border: 1px solid black;
  margin: 0.2em;
  padding: 0.4em;
  cursor: pointer;
`

export default class Emails extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <>
        <Header>
          <h1>Emails</h1>
          <Paginator>
            <PaginatorButton emailPage={this.props.emailPage} onClick={this.props.previousPage}><FaArrowLeft /></PaginatorButton>
            <PaginatorButton onClick={this.props.nextPage}><FaArrowRight /></PaginatorButton>
          </Paginator>
        </Header>

        <ButtonRow>
          <Button><input type="checkbox" onClick={this.props.toggleSelectAll} checked={this.props.selectAllEmailsChecked}/></Button>
          <Button onClick={this.props.markRead}>Mark Read</Button>
          <Button onClick={this.props.markUnread}>Mark Unread</Button>
          <Button>Delete</Button>
        </ButtonRow>

        {
          this.props.emails.map(email => {
            return (
              <EmailRow
                email={email}
                selectEmail={this.props.selectEmail}
                selectedEmails={this.props.selectedEmails}
              />
            )
          })
        }
      </>
    )
  }
}
