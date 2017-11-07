import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Portal } from 'react-portal';
import styled from 'styled-components';
import IconClose from 'react-icons/lib/md/close';

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
    const {onClose} = this.props;

    if (e.keyCode === 27) {
      onClose()
    }
  };
  componentWillMount() {
    window.addEventListener('keyup', this.handleKeyup);
  }
  render() {
    const { isOpen, title, children, onClose } = this.props;

    return (
      <Portal isOpen={isOpen}>
        <Mask>
          <Popup>
            <Header>{title}</Header>
            <Body>{children}</Body>
            <CloseLink onClick={() => onClose()}>
              <IconClose color="#ffffff" size={24} />
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
  display: flex;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
`;
const Popup = styled.div`
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.04);
  height: 350px;
  margin: 50px auto;
  max-width: 420px;
  padding: 50px;
  position: relative;
  width: 90%;
`;
const Header = styled.div`
  border-radius: 5px 5px 0 0;
  color: #4a4a4a;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
`;
const Body = styled.div`
  background: #fff;
  margin: 0 auto;
  min-width: 320px;
  width: 320px;
`;
const CloseLink = styled.span`
  align-items: center;
  background: #000;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  height: 42px;
  justify-content: center;
  position: absolute;
  right: -10px;
  top: -10px;
  width: 42px;
`;