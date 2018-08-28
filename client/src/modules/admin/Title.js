import React from 'react';
import styled from 'styled-components';
import { media } from 'styled';

export default ({ children }) => <Title>{children}</Title>;

const Title = styled.h1`
  border: none;
  font-weight: bold;
  font-size: 24px;
  margin: 0;
  padding: 0;
  ${media.mobile`
    display: none;
  `};
`;
