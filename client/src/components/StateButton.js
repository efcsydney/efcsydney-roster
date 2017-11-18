import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import SpinnerIcon from 'react-icons/lib/fa/spinner';
import CheckIcon from 'react-icons/lib/fa/check';
import CloseIcon from 'react-icons/lib/fa/close';

export default class StateButton extends Component {
  static propTypes = {
    kind: PropTypes.oneOf(['loading', 'success', 'failed', 'default'])
  };

  static defaultProps = {
    kind: 'default'
  };

  render() {
    const { children, kind, ...otherProps } = this.props;
    return (
      <Button {...otherProps}>
        {kind === 'loading' && <SpinIcon animate="spin" />}
        {kind === 'success' && <CheckIcon />}
        {kind === 'failed' && <CloseIcon />}
        &nbsp;
        {children}
      </Button>
    );
  }
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const SpinIcon = styled(SpinnerIcon)`animation: ${spin} infinite 2s linear;`;
const Button = styled.button.attrs({ type: 'button' })`
  background-color: #588c25;
  border-radius: 3px;
  border: 1px solid #466d1d;
  box-sizing: border-box;
  color: #fff;
  min-width: 110px;
  padding: 12px;
`;
