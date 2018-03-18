/**
 * <Auth
 *   onSuccess={}
 *   onFail={}>
 *   Content shows after checking
 * </Auth>
 */
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
    isChecking: false,
    hasLogin: false
  };
  addUser(rawData) {
    const { displayName, email, uid, photoURL } = rawData;

    return this.userRef.set({
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
      onFail('no-permission');
    } else {
      if (dbData.isEnabled) {
        hasLogin = true;
        onSuccess();
      } else {
        onFail('no-permission');
      }
    }

    if (this.mounted) {
      this.setState({
        isChecking: false,
        hasLogin
      });
    }
  };
  handleAuthStateChanged = user => {
    const { onFail } = this.props;

    if (!user) {
      this.setState({
        hasLogin: false,
        isChecking: false
      });
      onFail('not-login');
      return;
    }

    const { uid } = user;
    this.userRef = firebase.database().ref(`users/${uid}`);

    this.userRef
      .once('value')
      .then(snapshot => this.handleUserReceived(snapshot.val(), user));
  };
  constructor(props) {
    super(props);
    this.userRef = null;
  }
  componentDidMount() {
    this.mounted = true;
    this.setState({ isChecking: true });
    firebase.auth().onAuthStateChanged(this.handleAuthStateChanged);
  }
  componentWillUnmount() {
    this.mounted = false;
    if (this.userRef) {
      this.userRef.off('value', this.handleUserReceived);
    }
    this.handleUserReceived = () => {};
    this.handleAuthStateChanged = () => {};
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
