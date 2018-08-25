import React from 'react';
import styled from 'styled-components';

export default ({ title }) => (
  <Wrapper>
    {title && <h1>{title}</h1>}
    <p>Under Construction</p>
  </Wrapper>
);

const Wrapper = styled.div`
  padding: 10px;
  text-align: center;
`;
