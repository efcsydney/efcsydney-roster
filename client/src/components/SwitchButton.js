import _ from 'lodash';
import React, { Component } from 'react';
import styled from 'styled-components';

export default class SwitchButton extends Component {
  render() {
    const { checked, onChange, ...otherProps } = this.props;

    return (
      <Label {...otherProps}>
        <Input checked={checked} onChange={onChange} />
        <Switch>
          <Handle />
        </Switch>
        {this.props.children}
      </Label>
    );
  }
}

const Label = styled.label`
  display: inline-block;
`;
const Switch = styled.span`
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 0 0px rgba(0, 0, 0, 0.4);
  display: inline-block;
  height: 30px;
  margin: 0 8px 0 1px;
  transition-duration: 0.4s;
  transition-property: background-color, box-shadow;
  vertical-align: middle;
  width: 52px;
  position: relative;
  top: -1px;
`;
const Handle = styled.span`
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3), 0px 0px 0 1px rgba(0, 0, 0, 0.4);
  float: left;
  height: 30px;
  pointer-events: none;
  transition-duration: 0.4s;
  transition-property: transform, background-color, box-shadow;
  transition-timing-function: cubic-bezier(0.54, 1.85, 0.5, 1);
  width: 30px;
`;
const Input = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  &:checked + ${Switch} {
    background-color: #178dc7;
    border: 1px solid #0e62cd;
  }
  &:checked + ${Switch} > ${Handle} {
    background-color: #ffffff;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3),
      0px 0px 0 1px rgba(8, 80, 172, 1);
    transform: translate3d(23px, 0, 0);
  }
`;
