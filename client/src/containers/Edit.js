import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Modal from '../components/Modal';
import styled from 'styled-components';

export default class Edit extends Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    member: PropTypes.string,
    names: PropTypes.array,
    onSave: PropTypes.func,
    role: PropTypes.string
  };
  handleNameChange = e => {
    const value = e.target.value;

    this.setState({ selectedName: value });
  };
  handleSaveClick = form => {
    const { onSave } = this.props;

    onSave(form);
  };
  constructor(props) {
    super(props);

    this.state = {
      selectedName: props.member
    };
  }
  render() {
    const { date, member, names, onSave, role, ...otherProps } = this.props; // eslint-disable-line
    const { selectedName } = this.state;
    const formattedDate = moment(date).format('DD MMM, YYYY');

    return (
      <Modal {...otherProps}>
        <Form>
          <Row>
            <Label>Date</Label>
            <span>{formattedDate}</span>
          </Row>
          <Row>
            <Label>Role</Label>
            <span>{role}</span>
          </Row>
          <Row>
            <Label>Name</Label>
            <span>
              <Select value={selectedName} onChange={this.handleNameChange}>
                <option value="">-</option>
                {names.map((name, i) => <option key={i}>{name}</option>)}
              </Select>
            </span>
          </Row>
          <Row>
            <Button
              onClick={this.handleSaveClick.bind(this, {
                date,
                role,
                name: selectedName
              })}>
              Save
            </Button>
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
const Row = styled.div`
  align-items: center;
  display: flex;
  min-height: 50px;
  &:last-child {
    text-align: center;
    padding: 20px 0;
  }
`;
const Label = styled.label`
  display: inline-block;
  font-weight: bold;
  padding-right: 15px;
  text-align: right;
  width: 80px;
`;
const Select = styled.select`
  background-color: #fff;
  border-radius: 3px;
  border: 1px solid #ccc;
  box-shadow: inset 0 2px 1px 0 rgba(185, 185, 185, 0.3);
  display: inline-block;
  outline: none;
  padding: 10px;
`;
const Button = styled.button.attrs({ type: 'button' })`
  background-color: #588c25;
  border-radius: 3px;
  border: 1px solid #466d1d;
  box-sizing: border-box;
  color: #fff;
  min-width: 110px;
  padding: 12px;
`;
