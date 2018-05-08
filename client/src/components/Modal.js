import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Portal } from 'react-portal';
import styled from 'styled-components';
import IconClose from 'react-icons/lib/md/close';
import { media } from '../styled';

export default class Modal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string
  };
  static defaultProps = {
    isOpen: false
  };
  handleKeyup = e => {
    const { onClose } = this.props;

    if (e.keyCode === 27) {
      onClose();
    }
  };
  handlePopupClick = e => {
    e.stopPropagation();
  };
  componentDidMount() {
    const { isOpen } = this.props;

    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = isOpen ? 'hidden' : 'visible';
  }
  componentWillMount() {
    window.addEventListener('keyup', this.handleKeyup);
  }
  componentWillUnmount() {
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'visible';
    window.removeEventListener('keyup', this.handleKeyup);
  }
  render() {
    const { isOpen, title, children, onClose } = this.props;

    return (
      <Portal isOpen={isOpen}>
        <Mask onClick={onClose}>
          <Popup onClick={this.handlePopupClick}>
            <Header>{title}</Header>
            <Body>{children}</Body>
            <CloseLink onClick={onClose}>
              <IconClose color="#999" size={32} />
            </CloseLink>
          </Popup>
        </Mask>
      </Portal>
    );
  }
}

const Mask = styled.div`
  background: rgba(0, 0, 0, 0.7);
  bottom: 0;
  left: 0;
  overflow: auto;
  position: fixed;
  right: 0;
  text-align: center;
  top: 0;
  z-index: 3;
  ${media.print`
    display: none;
  `};
`;
const Popup = styled.div`
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.04);
  display: inline-block;
  margin: 6vh auto;
  max-width: 85%;
  min-width: 500px;
  position: relative;
  text-align: left;
  ${media.mobile`
    margin: 4vh auto;
    max-width: 90%;
    min-width: 320px;
    .Select-menu {
      height: 120px;
    }
    // The last option could be blocked by the keyboard window
    .Select-option:last-of-type {
      margin-bottom: 40px;
    }
  `};
`;
const Header = styled.div`
  border-radius: 5px 5px 0 0;
  color: #4a4a4a;
  font-size: 24px;
  font-weight: bold;
  padding: 50px 50px 30px;
  text-align: center;
  ${media.mobile`
    font-size: 20px;
    padding: 20px 10px 15px;
  `};
`;
const Body = styled.div`
  font-size: 15px;
  padding: 0 50px 20px;
  ${media.mobile`
    padding: 0 10px 30px;
  `};
`;
const CloseLink = styled.span`
  align-items: center;
  background: #000;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  display: flex;
  height: 42px;
  justify-content: center;
  position: absolute;
  right: -20px;
  top: -20px;
  width: 42px;
  ${media.mobile`
    background: transparent;
    box-shadow: none;
    right: none;
    left: 10px;
    top: 10px;
    background; none;
  `};
`;
