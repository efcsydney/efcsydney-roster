import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';

export default class SelectPerson extends Component {
  static propTypes = {
    selectedPerson: PropTypes.string
  };
  static defaultProps = {
    selectedPerson: 'May Chien'
  };

  state = {
    selectedValue: {label: '', value: ''}
  };

  handleOnChange = value => {
    this.setState({ selectedValue: value });
  };

  render() {
    const { selectedPerson, data } = this.props;
    const people = _(data.data)
      .map('members')
      .flatten()
      .map('name')
      .union()
      .zipWith(function(name) {
        return { value: name, label: name };
      })
      .value();
    return (
      <Wrapper>
        <Creatable
          multi={false}
          onChange={this.handleOnChange}
          options={people}
          value={this.selectedValue || selectedPerson }
        />
      </Wrapper>
    );
  }
}
const Wrapper = styled.div`font-size: 13px;`;
