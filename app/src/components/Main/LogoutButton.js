import React from "react"
import styled from 'styled-components'

const LogoutButton = styled.button`
  right: 10px;
`

const Container = styled.div`
  padding-right: 1em;
`

export default (props) => {
  return (
    <Container>
      <LogoutButton onClick={props.logout}>Log Out</LogoutButton>
    </Container>
  )
}
