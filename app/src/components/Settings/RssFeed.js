import React, { useState, PureComponent } from 'react'
import { IconContext } from 'react-icons'
import { FaTrash } from 'react-icons/fa'
import styled from 'styled-components'

const DB = styled.div`
  cursor: pointer;
`

const DeleteButton = (props) => {
  const [ hovered, setHovered ] = useState(false)
  return (
    <DB
      onClick={props.onClick}
      onMouseOver={() => {setHovered(true)}}
      onMouseOut={() => {setHovered(false)}}
    >
      <IconContext.Provider value={{color: hovered ? 'black' : '#aba7ac'}}>
        <FaTrash />
      </IconContext.Provider>
    </DB>
  )
}

const FeedRow = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 2em;
  border: 1px solid #ABA7AC;
  border-radius: 3px;
  padding: 0.5em;
  margin: 0.2em;
  flex-grow: 5;
  align-items: center;
`

export default class RssFeed extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      mouseOver: false
    }
    this.onMouseOver = this.onMouseOver.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
  }

  onMouseOver () {
    this.setState({
      mouseOver: true
    })
  }

  onMouseOut () {
    this.setState({
      mouseOver: false
    })
  }

  render () {
    return (
      <FeedRow
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
      >
        <div style={{flexGrow: 4}}>
          <div>
            {this.props.feed.get('title')}
          </div>
          { this.props.feed.get('description') ? <div>
            {this.props.feed.get('description')}
          </div> : null }
        </div>

        <DeleteButton onClick={this.props.deleteFeed(this.props.feed.get('id'))} />
      </FeedRow>
    )
  }
}

