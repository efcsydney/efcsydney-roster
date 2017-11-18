import { css } from 'styled-components';

export const MOBILE_BREAKPOINT = 420;

export const media = {
  mobile: (...args) => css`@media (max-width: ${MOBILE_BREAKPOINT}px) {${css(...args)};}`
};
