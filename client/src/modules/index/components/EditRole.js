import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Modal, StateButton } from 'components';
import styled from 'styled-components';
import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';
import _ from 'lodash';

function getOptions(names) {
  names = names.map(name => ({ value: name, label: name }));
  return names;
}

export default class EditRole extends Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    member: PropTypes.string,
    names: PropTypes.array,
    onSave: PropTypes.func,
    role: PropTypes.string
  };
  handleNameChange = option => {
    const value = _.get(option, 'value', null);
    let state = { selectedName: value };
    let { names } = this.props;
    if (!_.find(names, value)) {
      state.names = _.union(names, [value]).sort();
    }
    this.setState(state);
  };
  handleSaveClick = form => {
    const { onSave } = this.props;
    onSave(form);
  };
  constructor(props) {
    super(props);

    this.state = {
      names: props.names,
      selectedName: props.member
    };
  }
  render() {
    const { date, member, onSave, role, ...otherProps } = this.props; // eslint-disable-line
    const { selectedName, names } = this.state;
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
              <Select
                multi={false}
                value={selectedName}
                onChange={this.handleNameChange}
                options={getOptions(names)}
                clearable={true}
              />
            </span>
          </Row>
          <Row align="center">
            <StateButton
              onClick={this.handleSaveClick.bind(this, {
                date,
                role,
                name: selectedName
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
const Label = styled.label`
  display: inline-block;
  font-weight: bold;
  padding-right: 15px;
  text-align: right;
  width: 80px;
`;
const Select = styled(Creatable)`
  width: 180px;
`;
