import React from 'react';
import styled from 'styled-components';
import { media } from '../styled';
import Select from 'react-select';
//import 'react-select/dist/react-select.css';

export default ({ value, onServiceChange }) => (
  <Wrapper>
    <Logo />
    <Title>
      <Select
        className="ServiceSelect"
        value={value}
        clearable={false}
        options={[
          { value: 'english', label: 'English Sunday Service Roster' },
          { value: 'chinese', label: '中文堂服事表' }
        ]}
        onChange={onServiceChange}
      />
    </Title>
    <Org>EFC Sydney</Org>
  </Wrapper>
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
  vertical-align: middle;
  height: 32px;
  width: 32px;
`;
const Title = styled.span`
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  position: relative;
  z-index: 3;
  min-width: 300px;
  &:link,
  &:hover,
  &:visited {
    color: #fff;
    text-decoration: none;
  }
  ${media.mobile`
    min-width: 220px;
  `};
  ${media.mobile`
    font-size: 14px;
    position: static;
    left:auto;
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
