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
