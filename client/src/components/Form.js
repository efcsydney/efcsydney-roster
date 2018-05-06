import styled from 'styled-components';

export const Input = styled.input`
  opacity: ${props => props.opacity};
  background-color: ${props => props.bgColor ? props.bgColor : "#fff"};
  border: solid 1px #c1c1c1;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  color: #333;
  padding: 9px;
  width: 100%;
  display: block;
  &.extra-space-for-addon {
    padding-left: 48px;
  }
  &:hover {
    border-color: #8b8b8b;
  }
  &:focus {
    border-color: #64b8dc;
    box-shadow: none;
    outline: 0;
  }
  &[disabled] {
    background: #e5e5e5;
    border-color: #c1c1c1;
    box-shadow: none;
  }
  &::-webkit-input-placeholder {
    color: #999;
  }
  &:-moz-placeholder {
    color: #999;
  }
  &::-moz-placeholder {
    color: #999;
  }
  &:-ms-input-placeholder {
    color: #999;
  }
`;
Input.displayName = 'Input';
