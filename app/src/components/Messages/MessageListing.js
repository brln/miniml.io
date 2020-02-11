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
  background: ${p => p.enabled ? "black" : "white"};
  color: ${p => !p.enabled ? "black" : "white"};
`

const DateBox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 2em;
`

const Spinner = styled.div`
  border: 7px solid #f3f3f3;
  border-top: 7px solid #a6a6a6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
const SpinnerContainer = styled.div`
  width: 100%;
  display: flex;
  padding-top: 10em;
  justify-content: center;
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
    let listItems
    if (this.props.inboxLoading) {
      listItems = <SpinnerContainer><Spinner /></SpinnerContainer>
    } else {
      listItems = this.props.inboxItems.map(item => {
        if (item.get('type') === 'email') {
          const email = this.props.emails.get(item.get('id'))
          return (
            <EmailRow
              key={email.get('id')}
              email={email}
              openItem={this.props.openItem}
              selectEmail={this.props.selectEmail}
              showRead={this.props.showRead}
              checked={this.props.selectedEmails.includes(email.get('id'))}
            />
          )
        }  else if (item.get('type') === 'rssArticle') {
          const article = this.props.articles.get(item.get('id'))
          return (
            <RssArticleRow
              key={article.get('id')}
              article={article}
              openItem={this.props.openItem}
              rssFeeds={this.props.rssFeeds}
              showRead={this.props.showRead}
              selectRssArticle={this.props.selectRssArticle}
              checked={this.props.selectedRssArticles.includes(article.get('id'))}
            />
          )
        }
      })
    }

    return (
      <>
        <Header>
          <ButtonRow>
            <Button
              className="disable-select"
              onClick={this.props.toggleSelectAll}
              enabled={this.props.selectAllEmailsChecked}
            >
              <>All</>
            </Button>
            <Button
              className="disable-select"
              onClick={this.props.showReadToggle}
              enabled={this.props.showRead}
            >
              <>Show Read</>
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
