import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

import EmailRow from './EmailRow'
import RssArticleRow from './RssArticleRow'

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

export default class MessageListing extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const articles = this.props.articles.valueSeq().map(article => {
      return [article.get('pubDate'), (
        <RssArticleRow
          article={article}
        />
      )]
    })

    const emails = this.props.emails.valueSeq().map(email => {
      console.log(email.toJSON())
      return [email.get('date'), (
        <EmailRow
          email={email}
          selectEmail={this.props.selectEmail}
          selectedEmails={this.props.selectedEmails}
        />
      )]
    })

    const listItems = [...articles, ...emails].sort((a, b) => {
      return new Date(b[0]) - new Date(a[0])
    }).map(i => i[1])

    return (
      <>
        <Header>
          <ButtonRow>
            <Button className="disable-select">
              <input type="checkbox" onClick={this.props.toggleSelectAll} checked={this.props.selectAllEmailsChecked}/>
              <> All</>
            </Button>
            <Button className="disable-select" onClick={this.props.markRead}>Mark Read</Button>
            <Button className="disable-select" onClick={this.props.markUnread}>Mark Unread</Button>
            <Button className="disable-select" onClick={this.props.markArchived}>Archive</Button>
          </ButtonRow>

          <Paginator>
            <PaginatorButton emailPage={this.props.emailPage} onClick={this.props.previousPage}><FaArrowLeft /></PaginatorButton>
            <PaginatorButton onClick={this.props.nextPage}><FaArrowRight /></PaginatorButton>
          </Paginator>
        </Header>
        { listItems }
      </>
    )
  }
}
