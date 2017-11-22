import React from 'react';
import styled from 'styled-components';
import { media } from '../styled';

export default () => (
  <Wrapper>
    <Title>
      <Logo />English Sunday Service Roster
    </Title>
    <Org>EFC Sydney</Org>
  </Wrapper>
);

const Wrapper = styled.div`
  align-items: center;
  background: linear-gradient(to right, #666, #333);
  color: #fff;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  padding: 20px;
  img {
    border-radius: 8px;
    margin-right: 10px;
  }
  height: 72px;
  ${media.mobile`
    margin-bottom: 0;
  `};
`;
const Logo = styled.img.attrs({ src: '/logo.png' })`
  display: inline-block;
  vertical-align: middle;
  height: 32px;
  width: 32px;
`;
const Title = styled.a.attrs({ href: '/' })`
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  &:link,
  &:hover,
  &:visited {
    color: #fff;
    text-decoration: none;
  }
  position: absolute;
  left: 64px;
  ${media.mobile`
    position: initial;
    left:auto;
  `};
`;
const Org = styled.span`
  font-size: 18px;
  font-weight: bold;
  position: absolute;
  right: 64px;
  ${media.mobile`
    display: none;
  `};
`;
