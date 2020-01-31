import React from 'react'
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
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export default class Emails extends React.Component {
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

        @TODO: fix checkmarks to do actions instead of just marking read

        {
          this.props.emails.map(email => {
            return (
              <EmailRow
                email={email}
                toggleEmailRead={this.props.toggleEmailRead}
              />
            )
          })
        }
      </>
    )
  }
}
