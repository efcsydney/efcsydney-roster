import _ from 'lodash';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Form,
  FormGroup,
  FormRow,
  LoadingIndicator,
  Modal,
  StateButton,
  Input
} from 'components';
import styled from 'styled-components';
import { set } from 'dot-prop-immutable';
import validator from 'validator';
import { withResource } from 'resource';

class Popup extends Component {
  static propTypes = {
    data: PropTypes.object,
    mode: PropTypes.oneOf(['new', 'edit']).isRequired,
    isLoading: PropTypes.bool,
    hasCompleted: PropTypes.bool,
    hasInitialized: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func
  };
  static defaultProps = {
    data: {},
    isLoading: false,
    hasCompleted: false,
    hasInitialized: false,
    onClose: () => {},
    onSave: () => {}
  };
  constructor(props) {
    super(props);

    const { data } = props;

    if (props.mode === 'new') {
      this.state = { data: {} };
    } else {
      this.state = { data };
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { data: prevData } = prevState;
    const { data, hasInitialized, hasCompleted, mode, onClose } = this.props;
    const isNew = mode === 'new';

    if (!isNew) {
      const isReceivingInitData = hasInitialized && _.isEmpty(prevData);
      if (isReceivingInitData) {
        this.setState({ data });
      }
    }

    if (hasCompleted) {
      setTimeout(onClose, 500);
    }
  }
  handleChange = changes => {
    let data = _.clone(this.state.data);

    _.forOwn(changes, (change, key) => {
      data = set(data, key, change);
    });

    this.setState({ data });
  };
  handleSubmit = e => {
    const { onSave } = this.props;
    const { data } = this.state;

    e.preventDefault();

    onSave({
      ...data
    });
  };
  validateEmail = email => {
    if (_.isEmpty(email) || _.isNil(email)) {
      return false;
    } else {
      return validator.isEmail(email);
    }
  };
  validatePhone = phone => {
    if (_.isEmpty(phone) || _.isNil(phone)) {
      return false;
    } else {
      return validator.isMobilePhone(phone, 'en-AU');
    }
  };
  renderForm() {
    const { data } = this.state;
    const { isSaving, hasCompleted } = this.props;
    const primaryName = _.get(data, 'primaryName', '');
    const secondaryName = _.get(data, 'secondaryName', '');
    const email = _.get(data, 'email', '');
    const phone = _.get(data, 'phone', '');
    const isValidEmail = this.validateEmail(email);
    const isValidPhone = this.validatePhone(phone);

    const isButtonEnabled = !!(
      primaryName &&
      email &&
      isValidEmail &&
      isValidPhone
    );

    const buttonKind =
      (isSaving && 'loading') || (hasCompleted && 'success') || 'default';

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup label="Primary Name" isRequired={true}>
          <StyledInput
            data-hj-whitelist
            type="text"
            value={primaryName}
            maxLength={30}
            placeholder="e.g. Kyle"
            onChange={e => this.handleChange({ primaryName: e.target.value })}
          />
        </FormGroup>
        <FormGroup label="Secondary Name">
          <StyledInput
            data-hj-whitelist
            type="text"
            value={secondaryName}
            maxLength={30}
            placeholder="e.g. Kyle's nick name"
            onChange={e => this.handleChange({ secondaryName: e.target.value })}
          />
        </FormGroup>
        <FormGroup label="Email" isRequired={true}>
          <StyledInput
            data-hj-whitelist
            type="text"
            hasError={!isValidEmail}
            value={email}
            placeholder="e.g. Kyle@gmail.com"
            onChange={e => this.handleChange({ email: e.target.value })}
          />
        </FormGroup>
        <FormGroup label="Phone">
          <StyledInput
            data-hj-whitelist
            type="text"
            hasError={!isValidPhone}
            value={phone}
            maxLength={15}
            placeholder="e.g. 0400123123"
            onChange={e => this.handleChange({ phone: e.target.value })}
          />
        </FormGroup>
        <FormRow align="center">
          <StateButton
            kind={buttonKind}
            type="submit"
            disabled={!isButtonEnabled}>
            Save
          </StateButton>
        </FormRow>
      </Form>
    );
  }
  renderLoading() {
    return <LoadingIndicator active={true} height="200px" />;
  }
  render() {
    const { isLoading, mode, onClose } = this.props;
    const title = mode === 'new' ? 'Create User' : 'Edit User';

    return (
      <Modal isOpen={true} title={title} onClose={onClose}>
        {isLoading ? this.renderLoading() : this.renderForm()}
      </Modal>
    );
  }
}

const mapResourceToProps = (resource, state, ownProps) => {
  const selectedId = _.get(ownProps, 'data.id', 'creating');
  const data = _.get(resource, ['data', selectedId], {});

  const modifyStatus = _.get(resource, 'status.modify', {});
  const createStatus = _.get(resource, 'status.create', {});
  const isSaving =
    modifyStatus.loadingIds[selectedId] || createStatus.isLoading;
  const hasCompleted =
    modifyStatus.completedIds[selectedId] ||
    !_.isEmpty(createStatus.completedIds);

  const retrieveStatus = _.get(resource, 'status.retrieve', {});
  const hasInitialized = retrieveStatus.hasInitialized && !_.isEmpty(data);

  return {
    data,
    isSaving,
    hasCompleted,
    hasInitialized
  };
};

export default withResource('users', mapResourceToProps)(Popup);

const StyledInput = styled(Input)`
  width: 195px;
`;
