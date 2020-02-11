import React from 'react'
import {connect} from "react-redux"
import styled from "styled-components"
import functional from '../actions/functional'
import { setViewingEmail} from '../actions/standard'
import { MainBox } from '../components/Shared/MainBox'

import InboxItemShowPage from "./InboxItemShowPage"
import InboxItemPaginator from "../components/Shared/InboxItemPaginator"

const MessageBox = styled.div`
  border: 1px solid black;
`

class Email extends InboxItemShowPage {
  constructor(props) {
    super(props)
    this.backDisabled = this.backDisabled.bind(this)
    this.forwardDisabled = this.forwardDisabled.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.changePage = this.changePage.bind(this)
    this.nextItem = this.nextItem.bind(this)
  }

  static getDerivedStateFromProps (props, state) {
    if (props.email && props.email.get('id') !== props.emailID) {
      props.dispatch(setViewingEmail(props.emails.get(props.emailID)))
    }
  }

  componentDidMount () {
    if (!this.props.email) {
      this.props.dispatch(functional.getEmail(this.props.emailID)).then(() => {
        this.props.dispatch(functional.toggleEmailRead(this.props.emailID))
      })
    } else if (this.props.email.get('id') !== this.props.emailID) {
      this.props.dispatch(setViewingEmail(this.props.emails.get(this.props.emailID)))
    }
  }

  render () {
    if (this.props.email) {
      return (
        <MainBox>
          <InboxItemPaginator
            forwardDisabled={this.forwardDisabled()}
            backDisabled={this.backDisabled()}
            nextPage={this.nextPage}
            previousPage={this.previousPage}
          />

          <div>
            From: {this.props.email.get('fromAddress')}
          </div>

          <div>
            To: @{this.props.email.get('userID')}
          </div>

          <div>
            Subject: {this.props.email.get('subject')}
          </div>

          <MessageBox>
            <div dangerouslySetInnerHTML={{ __html: this.props.email.get('bodyHTML')}} />
          </MessageBox>


        </MainBox>
      )
    } else {
      return 'Loading...'
    }
  }
}

function mapStateToProps (state, passedProps) {
  const emailID = passedProps.match.params.id
  return {
    email: state.getIn(['localState', 'viewingEmail']),
    emailID,
    articles: state.getIn(['localState', 'articles']),
    emails: state.getIn(['localState', 'emails']),
    inboxItems: state.getIn(['localState', 'inboxItems']),
    itemID: emailID,
  }
}

export default connect(mapStateToProps)(Email)
