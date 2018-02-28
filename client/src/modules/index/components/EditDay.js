import dotProp from 'dot-prop-immutable';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { Modal, StateButton, SwitchButton } from 'components';
import { requestModifyServiceInfo, toggleEditDay } from 'modules/index/redux';
import { media } from 'styled';
import i18n from 'i18n';

const mapStateToProps = state => {
  const { meta: { isSaving, selectedData } } = state.index;

  return {
    day: _.get(selectedData, 'day', null),
    serviceInfo: _.get(selectedData, 'serviceInfo', {}),
    isSaving
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleEditDay,
      onSave: form => requestModifyServiceInfo(form),
      onClose: () => toggleEditDay(false)
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(
  class EditDay extends Component {
    displayName = 'EditDay';
    static propTypes = {
      day: PropTypes.string,
      title: PropTypes.string,
      isSaving: PropTypes.bool,
      serviceInfo: PropTypes.object,
      onSave: PropTypes.func
    };
    static defaultProps = {
      isSaving: false,
      serviceInfo: {},
      onSave: () => {}
    };
    getTrans(key) {
      return i18n.t(`${this.displayName}.${key}`);
    }
    handleFootnoteChange = e => {
      const footnote = e.target.value || '';
      const state = dotProp.set(this.state, 'serviceInfo.footnote', footnote);

      this.setState(state);
    };
    handleSkipReasonChange = e => {
      const skipService = !!e.target.checked;
      const skipReason = skipService ? this.getTrans('skipReason') : '';
      let state = _.clone(this.state);
      state = dotProp.set(state, 'serviceInfo.skipReason', skipReason);
      state = dotProp.set(state, 'serviceInfo.skipService', skipService);

      this.setState(state);
    };
    handleSave = e => {
      e.preventDefault();

      const { serviceInfo } = this.state;
      const { onSave } = this.props;

      onSave(serviceInfo);
    };
    constructor(props) {
      super(props);

      this.state = {
        serviceInfo: _.get(props, 'serviceInfo', {})
      };
    }
    render() {
      const { day, isSaving, toggleEditDay, ...otherProps } = this.props;
      const { serviceInfo: { footnote, skipReason } } = this.state;
      const formattedDate = moment(day).format(this.getTrans('dateFormat'));

      return (
        <Modal {...otherProps} title={this.getTrans('title')}>
          <Form onSubmit={this.handleSave}>
            <Row>
              <Label>{this.getTrans('dateTitle')}</Label>
              <span>{formattedDate}</span>
            </Row>
            <Row>
              <Label>{this.getTrans('footnoteTitle')}</Label>
              <span>
                <Input
                  data-hj-whitelist
                  autoFocus
                  type="text"
                  value={footnote}
                  placeholder={this.getTrans('footnotePlaceholder')}
                  onChange={this.handleFootnoteChange}
                />
              </span>
            </Row>
            <Row>
              <Label>{this.getTrans('skipReason')}</Label>
              <span>
                <SwitchButton
                  checked={!_.isEmpty(skipReason)}
                  onChange={this.handleSkipReasonChange}
                />
              </span>
            </Row>
            <Row align="center">
              <StateButton
                kind={isSaving ? 'loading' : 'default'}
                type="submit">
                {this.getTrans('saveLabel')}
              </StateButton>
              <CancelLink onClick={() => toggleEditDay(false)}>
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
  width: 125px;
  ${media.mobile`
    width: 60px;
  `};
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

const CancelLink = styled.a`
  color: #369;
  cursor: pointer;
  text-decoration: none;
  margin-left: 15px;
`;
CancelLink.displayName = 'CancelLink';
