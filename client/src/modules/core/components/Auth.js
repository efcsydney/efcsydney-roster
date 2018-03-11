import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LoadingIndicator } from 'components';
import firebase from 'firebase';
import config from 'config/firebase.json';

firebase.initializeApp(config);
export default class Auth extends Component {
  static propTypes = {
    onFail: PropTypes.func,
    onSuccess: PropTypes.func
  };
  static defaultProps = {
    onFail: () => {},
    onSuccess: () => {}
  };
  state = {
    isChecking: true,
    hasLogin: false
  };
  addUser(rawData) {
    const { displayName, email, uid, photoURL } = rawData;

    return firebase
      .database()
      .ref(`users/${uid}`)
      .set({
        id: uid,
        email,
        displayName,
        avatarUrl: photoURL,
        isEnabled: false
      });
  }
  handleUserReceived = (dbData, authData) => {
    const { onFail, onSuccess } = this.props;
    let hasLogin = false;

    if (!dbData) {
      this.addUser(authData);
      onFail();
    } else {
      if (dbData.isEnabled) {
        hasLogin = true;
        onSuccess();
      } else {
        onFail();
      }
    }
    this.setState({
      isChecking: false,
      hasLogin
    });
  };
  handleAuthStateChanged = user => {
    if (!user) {
      this.setState({
        hasLogin: false,
        isChecking: true
      });
      return;
    }

    const { uid } = user;
    firebase
      .database()
      .ref(`users/${uid}`)
      .on('value', snapshot => this.handleUserReceived(snapshot.val(), user));
  };
  componentDidMount() {
    this.setState({ isChecking: true });
    firebase.auth().onAuthStateChanged(this.handleAuthStateChanged);
  }
  render() {
    const { children } = this.props;
    const { isChecking } = this.state;

    if (isChecking) {
      return <LoadingIndicator active={true} height="auto" />;
    }

    return <div>{children}</div>;
  }
}
