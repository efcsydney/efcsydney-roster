import _ from 'lodash';
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
  componentDidMount() {
    const { onFail, onSuccess } = this.props;
    this.setState({ isChecking: true });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        onSuccess();
      } else {
        onFail();
      }
      this.setState({
        isChecking: false,
        hasLogin: !_.isEmpty(user)
      });
    });
  }
  render() {
    const { children } = this.props;
    const { isChecking } = this.state;
    if (isChecking) {
      return (
        <LoadingIndicator
          height="500px"
          active={true}
          bgcolor="rgba(255, 255, 255, 0.7)"
        />
      );
    }

    return <div>{children}</div>;
  }
}
