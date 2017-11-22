import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  getMemberNames,
  getQuarterDays,
  getQuarterFirstMonth,
  getQuarterLastMonth,
  getRoles
} from '../../utils';
import '../../icalstyle.css';
import styled from 'styled-components';
import { media, MOBILE_BREAKPOINT } from '../../styled';
import Desktop from './Desktop';
import Mobile from './Mobile';

export default class QuarterView extends Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date),
    data: PropTypes.object,
    onCellClick: PropTypes.func
  };
  static defaultProps = {
    date: new Date(),
    data: {},
    onCellClick: () => {}
  };
  handleCellClick = (day, role, member) => {
    const { data, onCellClick } = this.props;
    const names = getMemberNames(data.data);

    onCellClick({ day, role, member, names });
  };
  handleWindowResize = () => {
    this.setState({
      isMobile: document.body.offsetWidth <= MOBILE_BREAKPOINT
    });
  };
  constructor(props) {
    super(props);

    this.state = {
      isMobile: false
    };
  }
  componentWillMount() {
    this.handleWindowResize();
    window.addEventListener('resize', _.debounce(this.handleWindowResize, 500));
  }
  render() {
    const { date, data } = this.props;
    const { isMobile } = this.state;
    const days = getQuarterDays(date, 7);
    const roles = getRoles(data.data);
    const startMonth = getQuarterFirstMonth(date).format('MMM');
    const endMonth = getQuarterLastMonth(date).format('MMM');
    const year = days[0].format('YYYY');
    const viewProps = {
      events: data.data,
      days,
      roles,
      onDayClick: this.handleCellClick
    };

    return (
      <Wrapper>
        <Header className="zindexTitle">
          {startMonth} - {endMonth} {year}
        </Header>
        <BottomBar className="zindexTitle">
          {startMonth} - {endMonth} {year}
        </BottomBar>
        {isMobile && <Mobile {...viewProps}/>}
        {!isMobile && <Desktop {...viewProps}/>}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  font-size: 13px;
  ${media.mobile`
    margin-top: 20px;
  `};
`;
const Header = styled.h1`
  border-radius: 4px 4px 0 0;
  border-bottom: none;
  color: #fff;
  font-size 15px;
  padding: 15px 0;
  position: absolute;
  left: 10px;
  right: 10px;
  margin: 0;
  text-align: center;
  top: -70px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  ${media.mobile`
    display: none;
  `}
`;
const BottomBar = Header.extend`
  position: fixed;
  color: #666;
  background: #ffffff;
  top: auto;
  bottom: 0;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  ${media.mobile`
    font-size: 14px;
    display: inline-block;
  `};
`;