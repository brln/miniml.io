import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { almostWhite, brand, darkBrand } from '../../colors'
import { SIGNUP_VIEW } from "../../constants/actions"

const Title = styled.label`
  display: block;
  font-size: 1.1em;
  padding-left: 5px;
`

const MainBox = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  width: 300px;
  border: 2px solid ${darkBrand};
  background: ${almostWhite};
  display: flex;
  align-items: center;
  flex-direction: column;
`

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  min-height: 800px;
  left: 0;
  top: 0;
  background: ${almostWhite};
`

const LogoImage = styled.img`
  margin-top: 20px;
`

const EmailInput = styled.input`
  width: 200px;
  height: 40px;
  margin-right: 5px;
  margin-left: 5px;
`

const SubmitButton = styled.button`
  margin-top: 20px;
`

const ErrorBar = styled.div`
  background-color: red;
  position: fixed;
  width: 100%;
  height: 30px;
  top: 0;
  text-align: center;
  font-size: 18px;
  padding-top: 10px;
  z-index: 20;
  border-bottom: 3px solid ${'#43070d'};
`

const SignupLink = styled.div`
  padding-top: 2em;
  padding-bottom: 2em;
`

const SignupUnderline = styled.u`
  cursor: pointer;
`

export default class Login extends PureComponent {
  render () {
    let error
    if (this.props.error) {
      error = (
        <ErrorBar>{ this.props.error }</ErrorBar>
      )
    }
    return (
      <Background>
        { error }
        <MainBox>
          <h2>Log In</h2>
          <div style={{paddingTop: "10px"}}>
            <Title>username</Title>
            <EmailInput type={"text"} autoFocus={true} onChange={this.props.changeUsername} value={this.props.email}/>
          </div>

          <div style={{paddingTop: "10px"}}>
            <Title htmlFor="passwordInput">password</Title>
            <EmailInput
              onKeyUp={this.props.checkForSubmit('login')}
              id="passwordInput"
              type={"password"}
              onChange={this.props.changePassword}
              value={this.props.password}
            />
          </div>
          <SubmitButton onClick={this.props.doLogin}>Submit</SubmitButton>
          <SignupLink onClick={this.props.setView(SIGNUP_VIEW)}>Or, <SignupUnderline>Sign Up</SignupUnderline></SignupLink>
        </MainBox>
      </Background>
    )
  }
}
