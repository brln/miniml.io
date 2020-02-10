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

const DateBox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 2em;
`

export default class MessageListing extends React.PureComponent {
  constructor (props) {
    super(props)
    this.pageLabel = this.pageLabel.bind(this)
  }

  pageLabel () {
    switch (this.props.emailPage) {
      case 0:
        return 'Today'
      case 1:
        return 'Yesterday'
      default:
        return `${this.props.emailPage} days ago`
    }
  }

  render () {
    const articles = this.props.articles.valueSeq().map(article => {
      return [article.get('pubDate'), (
        <RssArticleRow
          key={article.get('id')}
          article={article}
          rssFeeds={this.props.rssFeeds}
          showRead={this.props.showRead}
          selectRssArticle={this.props.selectRssArticle}
          checked={this.props.selectedRssArticles.includes(article.get('id'))}
        />
      )]
    })

    const emails = this.props.emails.valueSeq().map(email => {
      return [email.get('date'), (
        <EmailRow
          key={email.get('id')}
          email={email}
          selectEmail={this.props.selectEmail}
          showRead={this.props.showRead}
          checked={this.props.selectedEmails.includes(email.get('id'))}
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
            <Button className="disable-select"  onClick={this.props.toggleSelectAll}>
              <input type="checkbox" checked={this.props.selectAllEmailsChecked}/>
              <> All</>
            </Button>
            <Button className="disable-select" onClick={this.props.showReadToggle}>
              <input type="checkbox" checked={this.props.showRead}/>
              <> Show Read</>
            </Button>
            <Button className="disable-select" onClick={this.props.markRead}>Mark Read</Button>
            { this.props.showRead ? <Button className="disable-select" onClick={this.props.markUnread}>Mark Unread</Button> : null }
          </ButtonRow>

          <ButtonRow>
            <DateBox className="disable-select">{this.pageLabel()}</DateBox>
            <Paginator>
              <PaginatorButton
                emailPage={this.props.emailPage}
                onClick={this.props.previousPage}
              >
                <FaArrowLeft />
              </PaginatorButton>
              <PaginatorButton
                onClick={this.props.nextPage}
              >
                <FaArrowRight />
              </PaginatorButton>
            </Paginator>
          </ButtonRow>

        </Header>
        { listItems }
      </>
    )
  }
}
