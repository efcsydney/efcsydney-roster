import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { switchCategory, retrieveServices } from '../redux';
import { createApiActions } from 'resource/actions';
import { media } from 'styled';
import i18n from 'i18n';

const mapStateToProps = state => ({
  services: state.core.data.services,
  value: state.core.meta.category
});
const mapDispatchToProps = dispatch => {
  const { retrieveServices: retrieveServices2 } = createApiActions('services');
  return bindActionCreators(
    { switchCategory, retrieveServices, retrieveServices2 },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(
  class NavBar extends Component {
    displayName = 'NavBar';
    static propTypes = {
      hasSwitcher: PropTypes.bool,
      services: PropTypes.array,
      title: PropTypes.string,
      onCategoryChange: PropTypes.func,
      value: PropTypes.string
    };
    static defaultProps = {
      hasSwitcher: true,
      services: [],
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
    componentWillMount() {
      const { hasSwitcher, retrieveServices, retrieveServices2 } = this.props;

      if (hasSwitcher) {
        retrieveServices();
        retrieveServices2({});
      }
    }
    render() {
      const { hasSwitcher, services, title, value } = this.props;

      return (
        <Wrapper>
          <a href="/">
            <Logo />
          </a>
          <Title>
            {title}
            {hasSwitcher && (
              <Select
                className="ServiceSelect"
                clearable={false}
                options={services.map(({ name, label }) => ({
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
);

const Wrapper = styled.div`
  align-items: center;
  background: linear-gradient(to right, #666, #333);
  color: #fff;
  display: flex;
  margin-bottom: 10px;
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
    width: auto;
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
