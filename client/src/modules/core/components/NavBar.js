import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { switchCategory } from '../redux';
import { media } from 'styled';
import i18n from 'i18n';

const mapStateToProps = state => ({ value: state.core.meta.category });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ switchCategory }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(
  class NavBar extends Component {
    displayName = 'NavBar';
    static propTypes = {
      onCategoryChange: PropTypes.func
    };
    static defaultProps = {
      onCategoryChange: () => {}
    };
    handleCategoryChange = ({ value }) => {
      const { switchCategory, onCategoryChange } = this.props;
      switchCategory(value);
      onCategoryChange(value);
    };
    render() {
      const { value } = this.props;

      return (
        <Wrapper>
          <a href="/">
            <Logo />
          </a>
          <Title>
            <Select
              className="ServiceSelect"
              clearable={false}
              options={[
                { value: 'english', label: 'English Sunday Service Roster' },
                { value: 'chinese', label: '中文堂服事表' }
              ]}
              onChange={this.handleCategoryChange}
              searchable={false}
              value={value}
            />
          </Title>
          <Org>{i18n.t(`${this.displayName}.orgTitle`)}</Org>
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
