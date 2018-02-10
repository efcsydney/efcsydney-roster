import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Modal, StateButton } from 'components';
import styled from 'styled-components';
import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';
import _ from 'lodash';
import { requestModifyIdEvents, toggleEditRole } from 'modules/index/redux';
import i18n from 'i18n';

function getOptions(names) {
  names = names.map(name => ({ value: name, label: name }));
  names = names.filter(name => name.label !== 'Combined Service');
  return names;
}

const mapStateToProps = state => {
  const { meta: { isSaving, selectedData } } = state.index;
  const day = _.get(selectedData, 'day');

  return {
    date: moment(day).format('YYYY-MM-DD'),
    member: _.get(selectedData, 'member', null),
    names: _.get(selectedData, 'names', []),
    role: _.get(selectedData, 'role', null),
    isSaving
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleEditRole,
      onSave: form => requestModifyIdEvents(form),
      onClose: () => toggleEditRole(false)
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(
  class EditRole extends Component {
    displayName = 'EditRole';
    static propTypes = {
      date: PropTypes.string,
      member: PropTypes.string,
      names: PropTypes.array,
      onSave: PropTypes.func,
      role: PropTypes.string
    };
    getTrans(key) {
      return i18n.t(`${this.displayName}.${key}`);
    }
    handleSave = form => {
      const { onSave } = this.props;
      onSave(form);
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
    constructor(props) {
      super(props);

      this.state = {
        names: props.names,
        selectedName: props.member
      };
    }
    render() {
      const {
        date,
        isSaving,
        role,
        preQuarterMembers,
        toggleEditRole,
        ...otherProps
      } = this.props; // eslint-disable-line
      const { selectedName, names } = this.state;
      const formattedDate = moment(date).format(this.getTrans('dateFormat'));
      const finalMembers = _.union(names, preQuarterMembers);

      return (
        <Modal {...otherProps} title={this.getTrans('title')}>
          <Form>
            <Row>
              <Label>{this.getTrans('dateTitle')}</Label>
              <span>{formattedDate}</span>
            </Row>
            <Row>
              <Label>{this.getTrans('roleTitle')}</Label>
              <span>{role}</span>
            </Row>
            <Row>
              <Label>{this.getTrans('nameTitle')}</Label>
              <span>
                <Select
                  multi={false}
                  value={selectedName}
                  onChange={this.handleNameChange}
                  options={getOptions(finalMembers)}
                  clearable={true}
                />
              </span>
            </Row>
            <HelpText>
              {`${this.getTrans('promptSelection')}: ${
                selectedName
                  ? selectedName
                  : this.getTrans('promptSelectionNone')
              }`}
            </HelpText>
            <Row align="center">
              <StateButton
                kind={isSaving ? 'loading' : 'default'}
                onClick={this.handleSave.bind(this, {
                  date,
                  role,
                  name: selectedName
                })}>
                {this.getTrans('saveLabel')}
              </StateButton>
              <CancelLink onClick={() => toggleEditRole(false)}>
                {this.getTrans('cancelLink')}
              </CancelLink>
            </Row>
          </Form>
        </Modal>
      );
    }
  }
);

const Form = styled.form`
  display: table;
  margin: 0 auto;
  position: relative;
`;
const Row = styled.div`
  align-items: center;
  display: flex;
  position: relative;
  min-height: 50px;
  &:last-child {
    text-align: center;
    padding: 20px 0;
  }
  justify-content: ${props => props.align || 'flex-start'};
`;
const HelpText = styled.div`
  color: #666;
  cursor: default;
  display: inline-block;
  font-size: 13px;
  margin-left: 100px;
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
const CancelLink = styled.a`
  color: #369;
  cursor: pointer;
  text-decoration: none;
  margin-left: 15px;
`;
