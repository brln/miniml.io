import styled from "styled-components"
import {Link} from "react-router-dom"

export const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex: 1;
`

export const Row = styled.div`
  display: flex;
  border: 1px solid black;
  padding: 0.5em;
  margin: 0.2em;
`

export const MarkReadBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5em;
  justify-content: center;
`

export const IconBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.8em;
  justify-content: center;
`

export const Subject = styled.div`
  font-size: 130%;
  color: ${p => p.read ? 'grey' : 'black'};
  padding-right: 1em;
`

export const From = styled.div`
  font-size: 130%;
  color: ${p => p.read ? 'grey' : 'black'};
`

export const PrettyLink = styled(Link)`
  text-decoration: none;
`

export const DateBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

