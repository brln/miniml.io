import React, { PureComponent } from 'react'
import styled from "styled-components"
import { Link } from 'react-router-dom'

import { logOut } from '../../actions/standard'

const Button = styled.div`
  margin-right: 1em;
  border: 1px solid white; 
  padding: 0.4em;
  cursor: pointer;
`

const DropdownItem = styled.div`
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;
`

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
`

const DropdownContent = styled.div`
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  right: 1em;
`

const StyledLink = styled(Link)`
    text-decoration: none;
    color: black;
`

export default class AccountButton extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      menuOpen: false
    }
    this.menuOpen = this.menuOpen.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside () {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        menuOpen: false
      })
    }
  }

  menuOpen () {
    this.setState({
      menuOpen: true
    })
  }

  render () {
    return (
      <Dropdown onClick={this.menuOpen} ref={x => this.wrapperRef = x}>
        <Button>Account</Button>
        {this.state.menuOpen ? <DropdownContent>
          <DropdownItem>
            <StyledLink to={'/settings'}>Settings</StyledLink>
          </DropdownItem>
          <DropdownItem onClick={this.props.logout}>Log Out</DropdownItem>
        </DropdownContent> : null }
      </Dropdown>
    )
  }
}
