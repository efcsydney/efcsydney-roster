import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import { Modal, StateButton } from '../../components';
//import { Creatable } from 'react-select';

export default class EditDay extends Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    footnote: PropTypes.string,
    onSave: PropTypes.func
  };
  handleFootnoteChange = e => {
    const footnote = e.target.value;
    this.setState({ footnote });
  };
  handleSaveClick = form => {
    const { onSave } = this.props;
    onSave(form);
  };
  constructor(props) {
    super(props);

    this.state = {
      footnote: props.footnote || ''
    };
  }
  render() {
    const { date, ...otherProps } = this.props;
    const { footnote } = this.state;
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
              <Input
                type="text"
                value={footnote}
                placeholder="ex. Holy Communion"
                onChange={this.handleFootnoteChange}
              />
            </span>
          </Row>
          <Row align="center">
            <StateButton
              onClick={this.handleSaveClick.bind(this, {
                date,
                footnote
              })}>
              Save
            </StateButton>
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
    border-color: #c1c1c1;
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
