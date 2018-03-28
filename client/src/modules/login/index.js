import React, { Component } from 'react';
import { Auth, NavBar } from 'modules/core';
import Button from 'components/Button';
import styled from 'styled-components';
import firebase from 'firebase';
import { injectGlobal } from 'styled-components';
import IconInfo from 'react-icons/lib/md/info-outline';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { loginError: false };
  }
  redirectTo = (page) => {
    const { history } = this.props;
    history.replace(page);
  }
  handleAuthSuccess = () => {
    this.setState({ loginError: false });
    this.redirectTo('/admin');
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
  handleBackClick = () => {
    this.setState({ loginError: false });
    this.redirectTo('/');
  }
  renderLoginError = () => {
    return (
      <Wrapper style={{maxWidth: '50%'}}>
        <SadFaceIcon />
        <Title>Almost there!</Title>
        <P>You have logged in successfully.<br /><br />However the System Administartor needs to review and grant your account permission before you can access Admin Portal. Please contact the system administartor for further assistance.</P>
        <Button style={{maxWidth: '200px', margin: '20px auto'}} onClick={this.handleBackClick}>Go to Home</Button>
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
const Title = styled.h1`
  font-size: 200%;
  color: #2d5faf;
  text-align: center;
`;
const P = styled.p`
  font-size: 1.5em;
  text-align: center;
`;
const SadFaceIcon = styled(IconInfo) `
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
