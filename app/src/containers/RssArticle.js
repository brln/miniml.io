import React, { PureComponent } from 'react'
import {connect} from "react-redux"
import styled from "styled-components"
import functional from '../actions/functional'
import { MainBox } from '../components/Shared/MainBox'

const MessageBox = styled.div`
  border: 1px solid black;
`

class RssArticle extends PureComponent {
  constructor(props) {
    super(props)
    this.toggleRead = this.toggleRead.bind(this)
  }

  toggleRead () {
    this.props.dispatch(functional.toggleRssArticleRead(this.props.article.get('id')))
  }

  componentDidMount () {
    if (!this.props.article) {
      this.props.dispatch(functional.getRssArticle(this.props.articleID)).then(() => {
        this.toggleRead()
      })
    } else {
      this.toggleRead()
    }
  }

  render () {
    if (this.props.article) {
      return (
        <MainBox>
          <h2>{ this.props.article.get('title') }</h2>
          <h4>{ this.props.article.get('author') }</h4>
          <div dangerouslySetInnerHTML={{ __html: this.props.article.get('content')}} />
          <a target="_blank" rel="noopener noreferrer" href={this.props.article.get('link')}>{this.props.article.get('link')}</a>
        </MainBox>
      )
    } else {
      return 'Loading...'
    }
  }
}

function mapStateToProps (state, passedProps) {
  const articleID = passedProps.match.params.id
  return {
    article: state.getIn(['localState', 'articles', articleID]),
    articleID,
  }
}

export default connect(mapStateToProps)(RssArticle)
