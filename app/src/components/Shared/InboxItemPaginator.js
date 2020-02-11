import React, { PureComponent } from 'react'
import styled from "styled-components"
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const Paginator = styled.div`
  display: flex;
  justify-content: space-between;
`
const PaginatorButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.3em;
  color: ${p => p.disabled ? 'grey' : 'black'};
  cursor: ${p => p.disabled ? '' : 'pointer'};
`

export default class InboxItemPaginator extends PureComponent {
  render () {
    return (
      <Paginator>
        <PaginatorButton
          disabled={this.props.backDisabled}
          currentPage={this.props.currentPage}
          onClick={this.props.backDisabled ? null : this.props.previousPage}
        >
          <FaArrowLeft />
        </PaginatorButton>
        <PaginatorButton
          disabled={this.props.forwardDisabled}
          currentPage={this.props.currentPage}
          onClick={this.props.forwardDisabled ? null : this.props.nextPage}
        >
          <FaArrowRight />
        </PaginatorButton>
      </Paginator>
    )
  }
}
