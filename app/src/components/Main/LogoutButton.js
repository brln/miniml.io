import React from "react"
import styled from 'styled-components'

const LogoutButton = styled.button`
  top: 10px;
  right: 10px;
  position: fixed;
`

export default (props) => {
  return (
    <LogoutButton onClick={props.logout}>Log Out</LogoutButton>
  )
}
