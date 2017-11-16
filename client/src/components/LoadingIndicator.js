/**
 * Usage 1 (Default values):
 *
 *   <LoadingIndicator active={true} overlay={false} height="500px"/>
 *
 * Usage 2 (Overlay):
 *
 *   <LoadingIndicator overlay={true} bgcolor="#f7f7f7" zIndex="auto"/>
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconSpinner from 'react-icons/lib/fa/spinner';
import styled, {keyframes} from 'styled-components';

export default class LoadingIndicator extends Component {
  static propTypes = {
    active: PropTypes.bool,
    bgcolor: PropTypes.string,
    height: PropTypes.string,
    overlay: PropTypes.bool,
    text: PropTypes.string,
    zIndex: PropTypes.string
  };
  static defaultProps = {
    active: true,
    overlay: false,
    text: 'Loading...'
  };
  render() {
    const { text, ...otherProps } = this.props;

    return (
      <Wrapper {...otherProps}>
        <Indicator>
          <Icon animate="spin"/>
          <Text>{text}</Text>
        </Indicator>
      </Wrapper>
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
const Wrapper = styled.div`
  text-align: center;
  display: ${props => props.active ? 'block' : 'none'};
  background-color: ${props =>
    props.bgcolor || (props.overlay ? '#f7f7f7' : 'transparent')};
  height: ${props => props.height || (props.overlay ? null : '500px')};
  zindex: ${props => props.zIndex || 'auto'};
  ${props =>
    props.overlay &&
    `
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  `} &:before {
    content: '';
    display: inline-block;
    height: 100%;
    margin-right: -0.25em;
    vertical-align: middle;
  }
`;
const Indicator = styled.span`
  color: #39c;
  display: inline-block;
  font-size: 16px;
  vertical-align: middle;
`;
const Icon = styled(IconSpinner)`
  animation: ${spin} infinite 2s linear;
  margin-right: 10px;
`;
const Text = styled.span`font-weight: bold;`;
