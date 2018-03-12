import React, { Component } from 'react';
import { Auth, NavBar } from 'modules/core';
import styled from 'styled-components';
import firebase from 'firebase';
import { injectGlobal } from 'styled-components';

export default class Login extends Component {
  handleAuthSuccess = () => {
    const { history } = this.props;

    history.replace('/admin');
  };
  handleLogin = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider);
  };
  render() {
    return (
      <Wrapper>
        <NavBar hasSwitcher={false} title="Roster System" />
        <Body>
          <Auth onSuccess={this.handleAuthSuccess}>
            <LoginButton onClick={this.handleLogin} />
          </Auth>
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
