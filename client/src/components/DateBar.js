import React from 'react';
import styled from 'styled-components';
import leftArrowIcon from '../assets/arrow_left.svg';
import rightArrowIcon from '../assets/arrow_right.svg';
import {
  getQuarterDays,
  getQuarterFirstMonth,
  getQuarterLastMonth
} from '../utils';

export default ({
  date,
  position,
  onPrevClick,
  onNextClick,
  ...otherProps
}) => {
  const days = getQuarterDays(date, 7);
  const startMonth = getQuarterFirstMonth(date).format('MMM');
  const endMonth = getQuarterLastMonth(date).format('MMM');
  const year = days[0].format('YYYY');

  return (
    <Wrapper position={position} {...otherProps}>
      <Arrow onClick={onPrevClick}>
        <img src={leftArrowIcon} role="presentation" alt="Prev" />
      </Arrow>
      <Label>
        {startMonth} - {endMonth} {year}
      </Label>
      <Arrow onClick={onNextClick}>
        <img src={rightArrowIcon} role="presentation" alt="Next" />
      </Arrow>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  align-items: center;
  background: #ffffff;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  font-size 15px;
  justify-content: space-between;
  margin: 0;
  overflow: hidden;
  padding: 8px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${props =>
    props.position === 'bottom' &&
    `
    position: fixed;
    bottom: 0;
    left: 10px;
    right: 10px;
  `}
`;
const Arrow = styled.a`
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  border-width: 0;
  bottom: 10px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  line-height: 0;
  outline: 0;
  transition: background 1s;
  width: 28px;
  &:hover {
    background: rgba(255, 255, 255, 1);
  }
  img {
    width: 18px;
    height: 18px;
    display: inline-block;
  }
`;
const Label = styled.span`
  font-weight: bold;
`;
