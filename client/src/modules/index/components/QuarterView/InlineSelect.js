import _ from 'lodash';
import $ from 'jquery';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Creatable } from 'react-select';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestModifyIdEvents, toggleEditRole } from 'modules/index/redux';
import styled from 'styled-components';
import { getOptions } from 'modules/index/utils';
import 'react-select/dist/react-select.css';

const mapStateToProps = state => {
  const { meta: { isSaving } } = state.index;
  return {
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
  class InlineSelect extends Component {
    static propTypes = {
      date: PropTypes.string,
      isSaving: PropTypes.bool,
      names: PropTypes.array,
      role: PropTypes.string,
      value: PropTypes.string,
      onClose: PropTypes.func,
      onSave: PropTypes.func
    };
    static defaultProps = {
      date: null,
      isSaving: false,
      names: [],
      role: null,
      value: null,
      onClose: () => {},
      onSave: () => {}
    };
    state = {
      direction: 'down'
    };
    handleChange = (option = {}) => {
      const { date, role, value, onClose, onSave } = this.props;
      const newValue =
        _.isObject(option) && _.isString(option.value)
          ? option.value.trim()
          : null;
      if (value === newValue) {
        onClose();
        return;
      }
      onSave({
        date,
        role,
        name: newValue
      });
    };
    handleClose = () => {
      this.props.onClose();
    };
    componentDidMount() {
      const $view = $('table[role=grid]').parent();
      const $cell = $(this.wrapperEl.parentNode);
      const viewOffsetTop = $view.offset().top;
      const cellOffsetTop = $cell.offset().top;
      const viewOffsetBottom = viewOffsetTop + $view.height();
      const cellOffsetBottom = cellOffsetTop + $cell.height();
      const bufferHeight = 200;
      if (
        cellOffsetTop - viewOffsetTop > bufferHeight &&
        cellOffsetBottom + bufferHeight > viewOffsetBottom
      ) {
        this.setState({ direction: 'up' });
      }
    }
    render() {
      const { isSaving, names, value } = this.props;
      const { direction } = this.state;
      return (
        <Wrapper innerRef={el => (this.wrapperEl = el)}>
          <Select
            className="inline-select"
            direction={direction}
            inputProps={{ 'data-hj-whitelist': true }}
            isLoading={isSaving}
            autofocus
            options={getOptions(names)}
            openOnFocus={true}
            multi={false}
            value={value}
            clearable={true}
            onClose={this.handleClose}
            onChange={this.handleChange}
            onBlur={this.handleClose}
          />
        </Wrapper>
      );
    }
  }
);

const Wrapper = styled.div`
  background: red;
  position: absolute;
  left: -1px;
  right: -1px;
  top: -1px;
  bottom: -1px;
  text-align: left;
`;
// Ref - https://gist.github.com/MartinHaeusler/6dfc3769df20f534a150efda39573f0d
const Select = styled(Creatable)`
  position: relative;
  width: 180px;
  &.inline-select,
  .Select-control {
    border-radius: 0;
    min-width: 100px;
    width: 100%;
    height: 100%;
  }
  ${props =>
    props.direction === 'up' &&
    `
    .Select-menu-outer {
      position: absolute !important;
      top: auto !important;
      bottom: calc(100% - 1px) !important;
      border-bottom-left-radius: 0px !important;
      border-bottom-right-radius: 0px !important;
      border-top-left-radius: 5px !important;
      border-top-right-radius: 5px !important;
    }
  `};
`;
