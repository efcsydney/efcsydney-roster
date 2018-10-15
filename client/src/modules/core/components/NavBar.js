import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled, { injectGlobal } from 'styled-components';
import { switchCategory } from '../redux';
import { media } from 'styled';
import i18n from 'i18n';
import { withResource } from 'resource';
import '../../../index.css';

const mapStateToProps = state => ({
  value: state.core.meta.category
});
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ switchCategory }, dispatch);
};
export default withResource('services')(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    class NavBar extends Component {
      displayName = 'NavBar';
      static propTypes = {
        hasSwitcher: PropTypes.bool,
        services: PropTypes.object,
        title: PropTypes.string,
        onCategoryChange: PropTypes.func,
        value: PropTypes.string
      };
      static defaultProps = {
        hasSwitcher: true,
        services: {},
        title: '',
        onCategoryChange: () => {},
        value: ''
      };
      getTrans(key) {
        return i18n.t(`${this.displayName}.${key}`);
      }
      handleCategoryChange = ({ value }) => {
        const { switchCategory, onCategoryChange } = this.props;
        switchCategory(value);
        onCategoryChange(value);
      };
      render() {
        const { hasSwitcher, services, title, value } = this.props;

        return (
          <Wrapper id="navbar">
            <a href="/">
              <Logo />
            </a>
            <Title>
              {title}
              {hasSwitcher && (
                <Select
                  className="ServiceSelect"
                  clearable={false}
                  options={_.map(services, ({ name, label }) => ({
                    value: name,
                    label
                  }))}
                  onChange={this.handleCategoryChange}
                  searchable={false}
                  value={value}
                />
              )}
            </Title>
            <Org>{this.getTrans('orgTitle')}</Org>
          </Wrapper>
        );
      }
    }
  )
);

const Wrapper = styled.div`
  align-items: center;
  background: linear-gradient(to right, #666, #333);
  color: #fff;
  display: flex;
  padding: 0 20px;
  img {
    border-radius: 8px;
    margin-right: 10px;
  }
  height: 72px;
  ${media.mobile`
    margin-bottom: 0;
    justify-content: center;
  `};
  ${media.print`
    height: 52px;
  `};
`;
const Logo = styled.img.attrs({ src: '/logo.png' })`
  display: inline-block;
  height: 32px;
  vertical-align: middle;
  width: 32px;
`;
const Title = styled.span`
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  position: relative;
  &:link,
  &:hover,
  &:visited {
    color: #fff;
    text-decoration: none;
  }
  .Select-option {
    white-space: nowrap;
  }
  .Select-menu-outer {
    min-width: 100%;
    max-height: 261px !important;
    width: auto;
  }
  .Select-menu {
    max-height: 259px !important;
  }
  ${media.mobile`
    font-size: 14px;
    left:auto;
    position: static;
  `};
`;
const Org = styled.span`
  font-size: 18px;
  font-weight: bold;
  margin-left: auto;
  ${media.mobile`
    display: none;
  `};
`;

injectGlobal`
  .ServiceSelect .Select-control {
    width: auto;
  }
  .ServiceSelect.Select:focus {
    outline: none;
  }
  .ServiceSelect.Select .Select-control,
  .ServiceSelect.Select.is-focused .Select-control {
    border: none;
    background: transparent;
    box-shadow: none;
  }
  .ServiceSelect .Select-control .Select-input:focus {
    background: none;
  }
  .ServiceSelect.Select .Select-arrow,
  .ServiceSelect.Select.is-focused .Select-arrow {
    border-color: #fff transparent transparent;
  }
  .ServiceSelect.Select.is-focused.is-open .Select-arrow {
    border-color: transparent transparent #999;
  }
  .ServiceSelect.Select.Select--single.is-focused > .Select-control .Select-value .Select-value-label,
  .ServiceSelect.Select.Select--single > .Select-control .Select-value .Select-value-label {
    color: #fff;
  }
  .ServiceSelect.Select.is-open .Select-control {
    background: #fff;
    border-color: #b3b3b3 #ccc #d9d9d9;
  }
  .ServiceSelect.Select.is-open.Select--single > .Select-control .Select-value .Select-value-label {
    color: #333;
  }
  .ServiceSelect .Select-arrow-zone:hover > .Select-arrow {
    border-top-color: #fff;
  }
  .ServiceSelect.Select.Select--single > .Select-control .Select-value {
    position: static;
  }
  .ServiceSelect .Select-input {
    position: absolute;
    left: -1000em;
    top: -1000em;
  }
`;
