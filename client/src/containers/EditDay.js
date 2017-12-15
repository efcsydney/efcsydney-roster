import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import Modal from '../components/Modal';
//import { Creatable } from 'react-select';
import StateButton from '../components/StateButton';

export default class EditRole extends Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    member: PropTypes.string,
    names: PropTypes.array,
    onSave: PropTypes.func,
    role: PropTypes.string
  };
  constructor(props) {
    super(props);

    this.state = {
      names: props.names
    };
  }
  render() {
    const { date, member, onSave, role, ...otherProps } = this.props; // eslint-disable-line
    const formattedDate = moment(date).format('DD MMM, YYYY');

    return (
      <Modal {...otherProps}>
        <Form>
          <Row>
            <Label>Date</Label>
            <span>{formattedDate}</span>
          </Row>
          <Row>
            <Label>Note</Label>
            <span>
              <Input placeholder="ex. Holy Communion"/>
            </span>
          </Row>
          <Row align="center">
            <StateButton>Save</StateButton>
          </Row>
        </Form>
      </Modal>
    );
  }
}

const Form = styled.form`
  display: table;
  margin: 0 auto;
  position: relative;
`;
Form.displayName = 'Form';

const Row = styled.div`
  align-items: center;
  display: flex;
  min-height: 50px;
  &:last-child {
    text-align: center;
    padding: 20px 0;
  }
  justify-content: ${props => props.align || 'flex-start'};
`;
Row.displayName = 'Row';

const Label = styled.label`
  display: inline-block;
  font-weight: bold;
  padding-right: 15px;
  text-align: right;
  width: 80px;
`;
Label.displayName = 'Label';

const Input = styled.input`
  background: #fff;
  border: solid 1px #c1c1c1;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  color: #333;
  padding: 9px;
  width: 100%;
  display: block;
  &.extra-space-for-addon {
      padding-left: 48px;
  }
  &:hover {
      border-color: #8b8b8b;
  }
  &:focus {
      border-color: #64b8dc;
      box-shadow: none;
      outline: 0;
  }
  &[disabled] {
      background: #e5e5e5;
      border-color:#c1c1c1;
      box-shadow: none;
  }
  &::-webkit-input-placeholder {
      color: #999;
  }
  &:-moz-placeholder {
      color: #999;
  }
  &::-moz-placeholder {
      color: #999;
  }
  &:-ms-input-placeholder {
      color: #999;
  }
`;
Input.displayName = 'Input';
