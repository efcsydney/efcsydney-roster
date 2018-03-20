import React, { Component } from 'react';
import { Auth, NavBar } from 'modules/core';
import Button from 'components/Button';
import styled from 'styled-components';
import firebase from 'firebase';
import { injectGlobal } from 'styled-components';
import SadFaceIcon from 'react-icons/lib/fa/frown-o';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { loginError: false };
  }
  handleAuthSuccess = () => {
    const { history } = this.props;
    this.setState({ loginError: false });
    history.replace('/admin');
  };
  handleAuthFail = (reason) => {
    if (reason === 'no-permission') {
      this.setState({ loginError: true });
    }
  }
  handleLogin = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider);
  };
  handleBackToLogin = () => {
    this.setState({ loginError: false });
  }
  renderLoginError = () => {
    return (
      <Wrapper>
        <ICON />
        <H1>Oops!</H1>
        <P> Your login has failed.</P>
        <Button onClick={this.handleBackToLogin}>Back</Button>
      </Wrapper>
    );
  }
  renderLoginButton = () => {
    return (
      <Auth onSuccess={this.handleAuthSuccess} onFail={this.handleAuthFail}>
        <LoginButton onClick={this.handleLogin} />
      </Auth>
    );
  }

  render() {
    const { loginError } = this.state;
    return (
      <Wrapper>
        <NavBar hasSwitcher={false} title="Roster System" />
        <Body>
          {loginError && this.renderLoginError()}
          {!loginError && this.renderLoginButton()}
        </Body>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const LoginButton = styled.a`
  display: inline-block;
  background-image: url(btn-facebook-login.png);
  background-size: 100%;
  cursor: pointer;
  width: 247px;
  height: 40px;
`;
const H1 = styled.h1`
  font-size:200%;
  color:red;
  text-align:center;
`;
const P = styled.p`
  font-size:1.5em;
  text-align:center;
`;
const ICON = styled(SadFaceIcon)`
  display: block;
  margin: 0 auto;
  width:250px;
  font-size: 1000%;
`;
const Body = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-grow: 2;
`;
injectGlobal`
  html, body {
    background-color: #eee !important;
  }
  body,
  #root {
    height: 100%;
`;
