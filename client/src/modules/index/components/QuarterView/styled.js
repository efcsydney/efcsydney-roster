import styled from 'styled-components';
import { css } from 'styled-components';

export const MOBILE_BREAKPOINT = 760;

export const media = {
  mobile: (...args) =>
    css`
      @media (max-width: ${MOBILE_BREAKPOINT}px) {
        ${css(...args)};
      }
    `
};

export const Grid = styled.div`
  border-left: solid 1px #f0f3f8;
  border-radius: 0 0 4px 4px;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  width: 100%;
`;
