import React from 'react';
import styled from 'styled-components';
import { media } from '../styled';

export default () => (
  <Wrapper>
    <Title>
      <ArrowSpaceLogo />
      <Logo />English Sunday Service Roster
    </Title>
    <Org>
      EFC Sydney<ArrowSpace />
    </Org>
  </Wrapper>
);

const Wrapper = styled.div`
  align-items: center;
  background: linear-gradient(to right, #666, #333);
  color: #fff;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 20px;
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
const ArrowSpace = styled.span`
  width: 44px;
  height: 5px;
  display: inline-block;
  ${media.mobile`
    width:24px;
  `};
`;
const ArrowSpaceLogo = ArrowSpace.extend`
  ${media.mobile`
    display:none;
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
  font-size: 18px;
  font-weight: bold;
  &:link,
  &:hover,
  &:visited {
    color: #fff;
    text-decoration: none;
  }
  ${media.mobile`
    font-size: 14px;
    position: static;
    left:auto;
  `};
`;
const Org = styled.span`
  font-size: 18px;
  font-weight: bold;
  ${media.mobile`
    display: none;
  `};
`;
