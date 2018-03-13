import styled from 'styled-components';

export const Grid = styled.table`
  background: #fff;
  border-collapse: collapse;
  border-radius: 8px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  margin: 0;
  padding: 0;
  min-width: 100%;
`;
export const Cell = styled.td`
  border: solid 1px #eee;
  border-width: 0 1px 0 0;
  overflow: hidden;
  padding: 10px;
  text-align: center;
  white-space: nowrap;
  width: ${props => props.width};
  &:empty:before {
    padding: 0;
    color: #ccc;
    content: '-';
  }
`;
export const HeaderCell = Cell.withComponent('th').extend`
  background-color: #eee;
  color: #666;
  font-weight: bold;
  text-align: center;
  &:first-child {
    border-top-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
  }
`;
export const Row = styled.tr`
  width: 100%;
  &:nth-child(odd) {
    background-color: #f8f8f8;
  }
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;
export default {
  Grid,
  Cell,
  HeaderCell,
  Row
};
