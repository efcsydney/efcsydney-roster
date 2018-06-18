import dotProp from 'dot-prop-immutable';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input } from 'components';
import styled from 'styled-components';
import { Modal, StateButton, SwitchButton } from 'components';
import { requestModifyServiceInfo, toggleEditDay } from 'modules/index/redux';
import { media } from 'styled';
import i18n from 'i18n';

const mapStateToProps = state => {
  const { meta: { category } } = state.core;
  const { meta: { isSaving, selectedData } } = state.index;
  const services = _.get(state, 'resource.data.services', {});
  const selectedService = _.find(services, { name: category });

  return {
    category,
    day: _.get(selectedData, 'day', null),
    serviceInfo: _.get(selectedData, 'serviceInfo', {}),
    footnoteLabel: selectedService.footnoteLabel || '',
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
      footnoteLabel: PropTypes.string,
      title: PropTypes.string,
      isSaving: PropTypes.bool,
      serviceInfo: PropTypes.object,
      onSave: PropTypes.func
    };
    static defaultProps = {
      footnoteLabel: '',
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
      const skipReason = e.target.value;
      const state = dotProp.set(
        this.state,
        'serviceInfo.skipReason',
        skipReason
      );

      this.setState(state);
    };
    handleSkipServiceChange = e => {
      const skipService = !!e.target.checked;
      const state = dotProp.set(
        this.state,
        'serviceInfo.skipService',
        skipService
      );

      this.setState(state);
    };
    handleSave = e => {
      e.preventDefault();

      let { serviceInfo } = this.state;
      const { category, day, onSave } = this.props;

      serviceInfo = _.merge(serviceInfo, {
        footnote: _.get(serviceInfo, 'footnote', '').trim(),
        skipReason: _.get(serviceInfo, 'skipReason', '').trim(),
        skipService: serviceInfo.skipService
      });

      onSave({
        category,
        date: day,
        ...serviceInfo
      });
    };
    constructor(props) {
      super(props);

      const serviceInfo = _.get(props, 'serviceInfo', {});

      if (!serviceInfo.skipReason) {
        _.set(serviceInfo, 'skipReason', this.getTrans('skipReason'));
      }

      this.state = { serviceInfo };
    }
    render() {
      const {
        day,
        footnoteLabel,
        isSaving,
        toggleEditDay,
        ...otherProps
      } = this.props;
      const { serviceInfo: { footnote, skipService, skipReason } } = this.state;
      const formattedDate = moment(day).format(this.getTrans('dateFormat'));

      return (
        <Modal {...otherProps} title={this.getTrans('title')}>
          <Form onSubmit={this.handleSave}>
            <Row>
              <Label>{this.getTrans('dateTitle')}</Label>
              <span>{formattedDate}</span>
            </Row>
            <Row>
              <Label>{footnoteLabel}</Label>
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
              {skipService ? (
                <StyledInput
                  data-hj-whitelist
                  type="text"
                  value={skipReason}
                  placeholder={this.getTrans('skipReason')}
                  onChange={this.handleSkipReasonChange}
                />
              ) : (
                <Label>
                  {skipReason ? skipReason : this.getTrans('skipReason')}
                </Label>
              )}

              <span>
                <SwitchButton
                  checked={skipService}
                  onChange={this.handleSkipServiceChange}
                />
              </span>
            </Row>
            <Row align="center">
              <StateButton
                kind={isSaving ? 'loading' : 'default'}
                type="submit"
                disabled={skipService && _.isEmpty(skipReason)}>
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

const StyledInput = styled(Input)`
  margin-right: 15px;
  width: 125px;
  ${media.mobile`
    width: 60px;
  `};
`;

const CancelLink = styled.a`
  color: #369;
  cursor: pointer;
  text-decoration: none;
  margin-left: 15px;
`;
CancelLink.displayName = 'CancelLink';
