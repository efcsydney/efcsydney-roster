import React from 'react';
import styled from 'styled-components';

export default () => (
  <Wrapper>
    <Logo/>
    <Title>English Sunday Service Roster</Title>
    <Org>EFC Sydney</Org>
  </Wrapper>
);

const Wrapper = styled.div`
  align-items: center;
  background: linear-gradient(to right, #666, #333);
  color: #fff;
  display: flex;
  margin-bottom: 10px;
  padding: 20px;
  img {
    border-radius: 8px;
    margin-right: 10px;
  }
`;
const Logo = styled.img.attrs({src: '/logo.png'})`
  display: inline-block;
  height: 32px;
  width: 32px;
`;
const Title = styled.a.attrs({href: '/'})`
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  &:link, &:hover, &:visited {
    color: #fff;
    text-decoration: none;
  }
`;
const Org = styled.span`
  font-size: 18px;
  font-weight: bold;
  margin-left: auto;
`;